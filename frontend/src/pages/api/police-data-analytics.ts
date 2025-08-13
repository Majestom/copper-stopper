import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../lib/database";
import { Database } from "better-sqlite3";

interface MonthlyStats {
  month: string;
  count: number;
}

interface AnalyticsResponse {
  monthlyStats: MonthlyStats[];
  totalStops: number;
  averagePerMonth: number;
}

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
    const monthsWithData = monthlyResults.length;
    const averagePerMonth =
      monthsWithData > 0 ? Math.round(totalStops / monthsWithData) : 0;

    const response: AnalyticsResponse = {
      monthlyStats: monthlyResults,
      totalStops,
      averagePerMonth,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Analytics API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
