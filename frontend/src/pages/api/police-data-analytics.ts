import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../lib/database";
import { Database } from "better-sqlite3";
import { ZodError } from "zod";
import {
  AnalyticsResponseSchema,
  type AnalyticsResponse,
  type MonthlyStats,
  type CategoryStats,
} from "../../schemas/analyticsSchemas";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db: Database = getDatabase();

    const monthlyQuery = `
      SELECT 
        strftime('%Y-%m', datetime) as month,
        COUNT(*) as count
      FROM stop_search 
      WHERE datetime IS NOT NULL
      GROUP BY strftime('%Y-%m', datetime)
      ORDER BY month ASC
    `;
    const monthlyResults = db.prepare(monthlyQuery).all() as MonthlyStats[];

    const totalQuery = `SELECT COUNT(*) as total FROM stop_search`;
    const totalResult = db.prepare(totalQuery).get() as { total: number };
    const totalStops = totalResult.total;

    const genderQuery = `
      SELECT 
        CASE 
          WHEN gender IS NULL OR TRIM(gender) = '' THEN 'Unknown'
          ELSE gender
        END as category,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / ${totalStops}, 1) as percentage
      FROM stop_search 
      GROUP BY gender
      ORDER BY count DESC
    `;
    const genderStats = db.prepare(genderQuery).all() as CategoryStats[];

    const ageRangeQuery = `
      SELECT 
        CASE 
          WHEN age_range IS NULL OR TRIM(age_range) = '' THEN 'Unknown'
          ELSE age_range
        END as category,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / ${totalStops}, 1) as percentage
      FROM stop_search 
      GROUP BY age_range
      ORDER BY count DESC
    `;
    const ageRangeStats = db.prepare(ageRangeQuery).all() as CategoryStats[];

    const outcomeQuery = `
      SELECT 
        CASE 
          WHEN outcome IS NULL OR TRIM(outcome) = '' THEN 'Unknown'
          ELSE outcome
        END as category,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / ${totalStops}, 1) as percentage
      FROM stop_search 
      GROUP BY outcome
      ORDER BY count DESC
      LIMIT 10
    `;
    const outcomeStats = db.prepare(outcomeQuery).all() as CategoryStats[];

    const searchTypeQuery = `
      SELECT 
        CASE 
          WHEN type IS NULL OR TRIM(type) = '' THEN 'Unknown'
          ELSE type
        END as category,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / ${totalStops}, 1) as percentage
      FROM stop_search 
      GROUP BY type
      ORDER BY count DESC
    `;
    const searchTypeStats = db
      .prepare(searchTypeQuery)
      .all() as CategoryStats[];

    const monthsWithData = monthlyResults.length;
    const averagePerMonth =
      monthsWithData > 0 ? Math.round(totalStops / monthsWithData) : 0;

    const response: AnalyticsResponse = {
      monthlyStats: monthlyResults,
      genderStats,
      ageRangeStats,
      outcomeStats,
      searchTypeStats,
      totalStops,
      averagePerMonth,
    };

    const validatedResponse = AnalyticsResponseSchema.parse(response);

    res.status(200).json(validatedResponse);
  } catch (error) {
    console.error("Analytics API error:", error);

    if (error instanceof ZodError) {
      console.error("Validation errors:", error.issues);
      res.status(500).json({ error: "Data validation failed" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
