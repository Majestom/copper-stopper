import { useQuery } from "@tanstack/react-query";
import {
  AnalyticsResponseSchema,
  type AnalyticsResponse,
} from "../schemas/analyticsSchemas";

async function fetchAnalyticsData(): Promise<AnalyticsResponse> {
  const response = await fetch("/api/police-data-analytics");

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  const data = await response.json();

  const validatedData = AnalyticsResponseSchema.parse(data);

  return validatedData;
}

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["analytics-data"],
    queryFn: fetchAnalyticsData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
