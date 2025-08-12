import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../lib/database";
import { z } from "zod";

const ClusterQueryParamsSchema = z.object({
  zoom: z.number().min(1).max(20).default(10),
  bbox: z.string().optional(), // "minLng,minLat,maxLng,maxLat"
  type: z.string().optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  outcome: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

type ClusterQueryParams = z.infer<typeof ClusterQueryParamsSchema>;

interface ClusterResult {
  cluster_lat: number;
  cluster_lng: number;
  point_count: number;
  bounds_min_lat: number;
  bounds_max_lat: number;
  bounds_min_lng: number;
  bounds_max_lng: number;
}

function parseClusterQueryParams(
  query: NextApiRequest["query"]
): ClusterQueryParams {
  const zoom = parseInt(query.zoom as string) || 10;

  const rawParams = {
    zoom,
    bbox: query.bbox as string,
    type: query.type as string,
    gender: query.gender as string,
    ageRange: query.ageRange as string,
    outcome: query.outcome as string,
    dateFrom: query.dateFrom as string,
    dateTo: query.dateTo as string,
  };

  return ClusterQueryParamsSchema.parse(rawParams);
}

function getClusterPrecision(zoom: number): number {
  // Adjust clustering precision based on zoom level
  if (zoom <= 8) return 1; // Very coarse: 0.1 degree (~11km)
  if (zoom <= 12) return 2; // Coarse: 0.01 degree (~1.1km)
  if (zoom <= 15) return 3; // Medium: 0.001 degree (~110m)
  return 4; // Fine: 0.0001 degree (~11m)
}

function buildClusterWhereClause(params: ClusterQueryParams): {
  where: string;
  values: (string | number)[];
} {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

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
      console.warn("Invalid bbox parameter:", params.bbox);
    }
  }

  if (params.type) {
    const types = params.type.split(",");
    const placeholders = types.map(() => "?").join(",");
    conditions.push(`type IN (${placeholders})`);
    values.push(...types);
  }

  if (params.gender) {
    const genders = params.gender.split(",");
    const placeholders = genders.map(() => "?").join(",");
    conditions.push(`gender IN (${placeholders})`);
    values.push(...genders);
  }

  if (params.ageRange) {
    const ageRanges = params.ageRange.split(",");
    const placeholders = ageRanges.map(() => "?").join(",");
    conditions.push(`age_range IN (${placeholders})`);
    values.push(...ageRanges);
  }

  if (params.outcome) {
    const outcomes = params.outcome.split(",");
    const placeholders = outcomes.map(() => "?").join(",");
    conditions.push(`outcome IN (${placeholders})`);
    values.push(...outcomes);
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
    const params = parseClusterQueryParams(req.query);
    const precision = getClusterPrecision(params.zoom);

    const { where, values } = buildClusterWhereClause(params);

    const sql = `
      SELECT 
        ROUND(latitude, ?) as cluster_lat,
        ROUND(longitude, ?) as cluster_lng,
        COUNT(*) as point_count,
        MIN(latitude) as bounds_min_lat,
        MAX(latitude) as bounds_max_lat,
        MIN(longitude) as bounds_min_lng,
        MAX(longitude) as bounds_max_lng
      FROM stop_search 
      ${where}
      GROUP BY ROUND(latitude, ?), ROUND(longitude, ?)
      HAVING COUNT(*) >= 1
      ORDER BY point_count DESC
      LIMIT 1000
    `;

    console.time("Cluster Query");
    const stmt = db.prepare(sql);
    const clusters = stmt.all(
      precision,
      precision,
      ...values,
      precision,
      precision
    ) as ClusterResult[];
    console.timeEnd("Cluster Query");

    const totalPoints = clusters.reduce(
      (sum, cluster) => sum + cluster.point_count,
      0
    );

    const countSql = `SELECT COUNT(*) as total FROM stop_search ${where}`;
    const countStmt = db.prepare(countSql);
    const countResult = countStmt.get(...values) as { total: number };

    console.log(
      `Generated ${clusters.length} clusters representing ${totalPoints}/${countResult.total} points`
    );

    return res.status(200).json({
      clusters,
      meta: {
        zoom: params.zoom,
        precision,
        clusterCount: clusters.length,
        pointsRepresented: totalPoints,
        totalPoints: countResult.total,
        bbox: params.bbox,
        queryType: "cluster-optimized",
      },
      filters: {
        type: params.type,
        gender: params.gender,
        ageRange: params.ageRange,
        outcome: params.outcome,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      },
    });
  } catch (error) {
    console.error("Cluster API error:", error);

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
