import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../lib/database";
import { StopSearchRecordSchema } from "../../schemas/dbSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = getDatabase();

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const sql = `
      SELECT 
        id, datetime, type, age_range, gender, self_defined_ethnicity, 
        officer_defined_ethnicity, legislation, object_of_search, outcome,
        outcome_linked_to_object_of_search, removal_of_more_than_outer_clothing,
        latitude, longitude, street_id, street_name, involved_person,
        operation, operation_name, force, source_date, created_at
      FROM stop_search 
      ORDER BY datetime DESC 
      LIMIT ?
    `;

    const stmt = db.prepare(sql);
    const rows = stmt.all(limit);

    const validatedRecords = rows.map((row) =>
      StopSearchRecordSchema.parse(row)
    );

    const countStmt = db.prepare("SELECT COUNT(*) as total FROM stop_search");
    const countResult = countStmt.get() as { total: number };

    return res.status(200).json({
      data: validatedRecords,
      pagination: {
        total: countResult.total,
        limit: limit,
        returned: validatedRecords.length,
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
