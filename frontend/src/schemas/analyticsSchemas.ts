import { z } from "zod";

export const MonthlyStatsSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
  count: z.number().int().nonnegative("Count must be a non-negative integer"),
});

export const CategoryStatsSchema = z.object({
  category: z.string().transform((val) => {
    const trimmed = val.trim();
    return trimmed === "" ? "Unknown" : trimmed;
  }),
  count: z.number().int().nonnegative("Count must be a non-negative integer"),
  percentage: z
    .number()
    .min(0)
    .max(100, "Percentage must be between 0 and 100"),
});

export const EthnicityTrendSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.object({
      count: z.number().int().nonnegative(),
      percentage: z.number().min(0).max(100),
    })
  )
);

export const AnalyticsResponseSchema = z.object({
  monthlyStats: z.array(MonthlyStatsSchema),
  genderStats: z.array(CategoryStatsSchema),
  ageRangeStats: z.array(CategoryStatsSchema),
  outcomeStats: z.array(CategoryStatsSchema),
  searchTypeStats: z.array(CategoryStatsSchema),
  ethnicityTrends: EthnicityTrendSchema,
  totalStops: z
    .number()
    .int()
    .nonnegative("Total stops must be a non-negative integer"),
  averagePerMonth: z
    .number()
    .int()
    .nonnegative("Average per month must be a non-negative integer"),
});

export type MonthlyStats = z.infer<typeof MonthlyStatsSchema>;
export type CategoryStats = z.infer<typeof CategoryStatsSchema>;
export type EthnicityTrend = z.infer<typeof EthnicityTrendSchema>;
export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;
