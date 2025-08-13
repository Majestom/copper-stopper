import { useQuery } from "@tanstack/react-query";

interface MonthlyStats {
  month: string;
  count: number;
}

interface AnalyticsResponse {
  monthlyStats: MonthlyStats[];
  totalStops: number;
  averagePerMonth: number;
}

async function fetchAnalyticsData(): Promise<AnalyticsResponse> {
  const response = await fetch("/api/police-data-analytics");

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  return response.json();
}

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["analytics-data"],
    queryFn: fetchAnalyticsData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
