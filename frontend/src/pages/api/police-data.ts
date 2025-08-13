import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/database";
import { StopSearchRecordSchema } from "@/schemas/dbSchemas";
import { Database } from "better-sqlite3";
import { QueryParams } from "@/schemas/analyticsSchemas";

function parseQueryParams(query: NextApiRequest["query"]): QueryParams {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const pageSize = Math.min(
    500,
    Math.max(10, parseInt(query.pageSize as string) || 100)
  );
  const sortField = (query.sortField as string) || "datetime";
  const sortDirection =
    (query.sortDirection as string) === "asc" ? "asc" : "desc";
  const skipCount = query.skipCount === "true";

  return {
    page,
    pageSize,
    sortField,
    sortDirection,
    search: query.search as string,
    type: query.type as string,
    gender: query.gender as string,
    ageRange: query.ageRange as string,
    outcome: query.outcome as string,
    dateFrom: query.dateFrom as string,
    dateTo: query.dateTo as string,
    skipCount,
  };
}

function buildWhereClause(params: QueryParams): {
  where: string;
  values: (string | number)[];
} {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (params.search) {
    const searchTerm = `%${params.search}%`;

    conditions.push(`(
      type LIKE ? COLLATE NOCASE OR 
      gender LIKE ? COLLATE NOCASE OR 
      outcome LIKE ? COLLATE NOCASE OR
      age_range LIKE ? COLLATE NOCASE OR
      object_of_search LIKE ? COLLATE NOCASE OR
      street_name LIKE ? COLLATE NOCASE OR
      legislation LIKE ? COLLATE NOCASE OR
      self_defined_ethnicity LIKE ? COLLATE NOCASE OR
      officer_defined_ethnicity LIKE ? COLLATE NOCASE
    )`);

    values.push(
      searchTerm, // type
      searchTerm, // gender
      searchTerm, // outcome
      searchTerm, // age_range
      searchTerm, // object_of_search
      searchTerm, // street_name
      searchTerm, // legislation
      searchTerm, // self_defined_ethnicity
      searchTerm // officer_defined_ethnicity
    );
  }

  if (params.type) {
    conditions.push("type = ?");
    values.push(params.type);
  }

  if (params.gender) {
    conditions.push("gender = ?");
    values.push(params.gender);
  }

  if (params.ageRange) {
    conditions.push("age_range = ?");
    values.push(params.ageRange);
  }

  if (params.outcome) {
    conditions.push("outcome = ?");
    values.push(params.outcome);
  }

  if (params.dateFrom) {
    conditions.push("datetime >= ?");
    values.push(params.dateFrom);
  }

  if (params.dateTo) {
    conditions.push("datetime <= ?");
    values.push(params.dateTo);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, values };
}

function getSortClause(
  sortField: string,
  sortDirection: "asc" | "desc"
): string {
  const allowedFields = [
    "datetime",
    "type",
    "age_range",
    "gender",
    "outcome",
    "object_of_search",
    "street_name",
    "force",
  ];

  const field = allowedFields.includes(sortField) ? sortField : "datetime";
  const direction = sortDirection === "asc" ? "ASC" : "DESC";

  return `ORDER BY ${field} ${direction}`;
}

const countCache = new Map<string, { count: number; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedCount(
  cacheKey: string,
  db: Database,
  countSql: string,
  values: (string | number)[]
): number {
  const cached = countCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.count;
  }

  const countStmt = db.prepare(countSql);
  const result = countStmt.get(...values) as { total: number };

  countCache.set(cacheKey, {
    count: result.total,
    timestamp: Date.now(),
  });

  return result.total;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = getDatabase();
    const params = parseQueryParams(req.query);

    const { where, values } = buildWhereClause(params);
    const sortClause = getSortClause(params.sortField!, params.sortDirection!);

    const offset = (params.page - 1) * params.pageSize;

    const checkLimit = params.pageSize + 1;

    const sql = `
      SELECT 
        id, datetime, type, age_range, gender, self_defined_ethnicity, 
        officer_defined_ethnicity, legislation, object_of_search, outcome,
        outcome_linked_to_object_of_search, removal_of_more_than_outer_clothing,
        latitude, longitude, street_id, street_name, involved_person,
        operation, operation_name, force, source_date, created_at
      FROM stop_search 
      ${where}
      ${sortClause}
      LIMIT ? OFFSET ?
    `;

    console.time("Data Query");
    const stmt = db.prepare(sql);
    const rows = stmt.all(...values, checkLimit, offset);
    console.timeEnd("Data Query");

    const hasMore = rows.length > params.pageSize;
    const actualRows = hasMore ? rows.slice(0, params.pageSize) : rows;

    let total = 0;
    let totalPages = 0;

    if (
      !params.skipCount &&
      (params.page === 1 || req.query.needsCount === "true")
    ) {
      console.time("Count Query");
      const countSql = `SELECT COUNT(*) as total FROM stop_search ${where}`;
      const cacheKey = `count_${Buffer.from(
        countSql + values.join(",")
      ).toString("base64")}`;
      total = getCachedCount(cacheKey, db, countSql, values);
      totalPages = Math.ceil(total / params.pageSize);
      console.timeEnd("Count Query");
    } else if (params.skipCount) {
      // Estimate total based on current page (useful for very large datasets)
      total = -1; // Indicate unknown
      totalPages = -1;
    }

    console.time("Validation");
    const validatedRecords = actualRows.map((row) =>
      StopSearchRecordSchema.parse(row)
    );
    console.timeEnd("Validation");

    return res.status(200).json({
      data: validatedRecords,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        total: total >= 0 ? total : undefined,
        totalPages: totalPages >= 0 ? totalPages : undefined,
        hasNext: hasMore,
        hasPrevious: params.page > 1,
        returned: validatedRecords.length,
        isEstimate: total < 0,
        queryTimeHint: "Optimized for large dataset",
      },
      filters: {
        search: params.search,
        type: params.type,
        gender: params.gender,
        ageRange: params.ageRange,
        outcome: params.outcome,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      },
      sort: {
        field: params.sortField,
        direction: params.sortDirection,
      },
    });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof Error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Unknown error occurred",
    });
  }
}
