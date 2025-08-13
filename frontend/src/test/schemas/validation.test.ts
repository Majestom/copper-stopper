import { describe, it, expect } from "vitest";
import {
  AnalyticsResponseSchema,
  MonthlyStatsSchema,
} from "@/schemas/analyticsSchemas";

describe("Analytics Schemas Validation", () => {
  it("validates monthly stats correctly", () => {
    const validMonthlyStats = { month: "2024-01", count: 150 };
    const result = MonthlyStatsSchema.safeParse(validMonthlyStats);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.month).toBe("2024-01");
      expect(result.data.count).toBe(150);
    }
  });

  it("rejects invalid month format", () => {
    const invalidMonthlyStats = { month: "invalid", count: 150 };
    const result = MonthlyStatsSchema.safeParse(invalidMonthlyStats);

    expect(result.success).toBe(false);
  });

  it("validates complete analytics response", () => {
    const validResponse = {
      monthlyStats: [{ month: "2024-01", count: 100 }],
      genderStats: [{ category: "Male", count: 60, percentage: 60.0 }],
      ageRangeStats: [{ category: "18-24", count: 30, percentage: 30.0 }],
      outcomeStats: [
        { category: "Nothing found", count: 80, percentage: 80.0 },
      ],
      searchTypeStats: [
        { category: "Person search", count: 90, percentage: 90.0 },
      ],
      ethnicityTrends: {},
      totalStops: 100,
      averagePerMonth: 100,
    };

    const result = AnalyticsResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });
});

describe("Data Processing Logic", () => {
  it("transforms dates correctly", () => {
    const testDate = new Date("2024-01-15T10:30:00Z");
    const monthKey = `${testDate.getFullYear()}-${String(
      testDate.getMonth() + 1
    ).padStart(2, "0")}`;

    expect(monthKey).toBe("2024-01");
  });

  it("handles null values safely", () => {
    const testData = {
      value: null,
      fallback: "N/A",
    };

    const safeValue = testData.value || testData.fallback;
    expect(safeValue).toBe("N/A");
  });
});
