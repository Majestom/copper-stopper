import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../lib/database";
import { StopSearchRecordSchema } from "../../schemas/dbSchemas";
import { z } from "zod";

const MapQueryParamsSchema = z.object({
  bbox: z.string().optional(),
  type: z.string().optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  selfDefinedEthnicity: z.string().optional(),
  officerDefinedEthnicity: z.string().optional(),
  legislation: z.string().optional(),
  objectOfSearch: z.string().optional(),
  outcome: z.string().optional(),
  outcomeLinkedToObjectOfSearch: z.string().optional(),
  removalOfMoreThanOuterClothing: z.string().optional(),
  streetName: z.string().optional(),
  involvedPerson: z.string().optional(),
  operation: z.string().optional(),
  operationName: z.string().optional(),
  force: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.number().optional(),
});

type MapQueryParams = z.infer<typeof MapQueryParamsSchema>;

function parseMapQueryParams(query: NextApiRequest["query"]): MapQueryParams {
  const limit = Math.min(
    10000,
    Math.max(1000, parseInt(query.limit as string) || 5000)
  );

  const rawParams = {
    bbox: query.bbox as string,
    type: query.type as string,
    gender: query.gender as string,
    ageRange: query.ageRange as string,
    selfDefinedEthnicity: query.selfDefinedEthnicity as string,
    officerDefinedEthnicity: query.officerDefinedEthnicity as string,
    legislation: query.legislation as string,
    objectOfSearch: query.objectOfSearch as string,
    outcome: query.outcome as string,
    outcomeLinkedToObjectOfSearch:
      query.outcomeLinkedToObjectOfSearch as string,
    removalOfMoreThanOuterClothing:
      query.removalOfMoreThanOuterClothing as string,
    streetName: query.streetName as string,
    involvedPerson: query.involvedPerson as string,
    operation: query.operation as string,
    operationName: query.operationName as string,
    force: query.force as string,
    dateFrom: query.dateFrom as string,
    dateTo: query.dateTo as string,
    limit,
  };

  return MapQueryParamsSchema.parse(rawParams);
}

function buildMapWhereClause(params: MapQueryParams): {
  where: string;
  values: (string | number)[];
} {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  // Todo: add reporting of missing coordinates
  conditions.push("latitude IS NOT NULL AND longitude IS NOT NULL");

  if (params.bbox) {
    try {
      const [minLng, minLat, maxLng, maxLat] = params.bbox
        .split(",")
        .map((num) => parseFloat(num.trim()));

      if (
        !isNaN(minLng) &&
        !isNaN(minLat) &&
        !isNaN(maxLng) &&
        !isNaN(maxLat)
      ) {
        conditions.push(
          "longitude BETWEEN ? AND ? AND latitude BETWEEN ? AND ?"
        );
        values.push(minLng, maxLng, minLat, maxLat);
      }
    } catch (error) {
      console.warn("Invalid bbox parameter:", params.bbox, ". Error: ", error);
    }
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

  if (params.selfDefinedEthnicity) {
    conditions.push("self_defined_ethnicity = ?");
    values.push(params.selfDefinedEthnicity);
  }

  if (params.officerDefinedEthnicity) {
    conditions.push("officer_defined_ethnicity = ?");
    values.push(params.officerDefinedEthnicity);
  }

  if (params.legislation) {
    conditions.push("legislation = ?");
    values.push(params.legislation);
  }

  if (params.objectOfSearch) {
    conditions.push("object_of_search = ?");
    values.push(params.objectOfSearch);
  }

  if (params.outcome) {
    conditions.push("outcome = ?");
    values.push(params.outcome);
  }

  if (params.outcomeLinkedToObjectOfSearch) {
    const boolValue = params.outcomeLinkedToObjectOfSearch === "true" ? 1 : 0;
    conditions.push("outcome_linked_to_object_of_search = ?");
    values.push(boolValue);
  }

  if (params.removalOfMoreThanOuterClothing) {
    const boolValue = params.removalOfMoreThanOuterClothing === "true" ? 1 : 0;
    conditions.push("removal_of_more_than_outer_clothing = ?");
    values.push(boolValue);
  }

  if (params.streetName) {
    conditions.push("street_name LIKE ? COLLATE NOCASE");
    values.push(`%${params.streetName}%`);
  }

  if (params.involvedPerson) {
    const boolValue = params.involvedPerson === "true" ? 1 : 0;
    conditions.push("involved_person = ?");
    values.push(boolValue);
  }

  if (params.operation) {
    const boolValue = params.operation === "true" ? 1 : 0;
    conditions.push("operation = ?");
    values.push(boolValue);
  }

  if (params.operationName) {
    conditions.push("operation_name LIKE ? COLLATE NOCASE");
    values.push(`%${params.operationName}%`);
  }

  if (params.force) {
    conditions.push("force = ?");
    values.push(params.force);
  }

  if (params.dateFrom) {
    conditions.push("datetime >= ?");
    values.push(params.dateFrom);
  }

  if (params.dateTo) {
    conditions.push("datetime <= ?");
    values.push(params.dateTo);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  return { where, values };
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
    const params = parseMapQueryParams(req.query);

    const { where, values } = buildMapWhereClause(params);

    const sql = `
      SELECT 
        id, datetime, type, age_range, gender, self_defined_ethnicity, 
        officer_defined_ethnicity, legislation, object_of_search, outcome,
        outcome_linked_to_object_of_search, removal_of_more_than_outer_clothing,
        latitude, longitude, street_id, street_name, involved_person,
        operation, operation_name, force, source_date, created_at
      FROM stop_search 
      ${where}
      ORDER BY datetime DESC
      LIMIT ?
    `;

    console.time("Map Data Query");
    const stmt = db.prepare(sql);
    const rows = stmt.all(...values, params.limit);
    console.timeEnd("Map Data Query");

    console.time("Map Data Validation");
    const validatedRecords = rows.map((row) =>
      StopSearchRecordSchema.parse(row)
    );
    console.timeEnd("Map Data Validation");

    return res.status(200).json({
      data: validatedRecords,
      meta: {
        returned: validatedRecords.length,
        limit: params.limit,
        hasMore: validatedRecords.length === params.limit,
        bbox: params.bbox,
        queryType: "map-optimized",
      },
      filters: {
        type: params.type,
        gender: params.gender,
        ageRange: params.ageRange,
        selfDefinedEthnicity: params.selfDefinedEthnicity,
        officerDefinedEthnicity: params.officerDefinedEthnicity,
        legislation: params.legislation,
        objectOfSearch: params.objectOfSearch,
        outcome: params.outcome,
        outcomeLinkedToObjectOfSearch: params.outcomeLinkedToObjectOfSearch,
        removalOfMoreThanOuterClothing: params.removalOfMoreThanOuterClothing,
        streetName: params.streetName,
        involvedPerson: params.involvedPerson,
        operation: params.operation,
        operationName: params.operationName,
        force: params.force,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      },
    });
  } catch (error) {
    console.error("Map API error:", error);

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
