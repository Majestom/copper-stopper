import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const MapFiltersSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  type: z.string().optional(),
  bbox: z.string().optional(),
});

type MapFilters = z.infer<typeof MapFiltersSchema>;

type FetchMapDataParams = {
  filters?: MapFilters;
  limit?: number;
};

async function fetchMapData({ filters, limit = 5000 }: FetchMapDataParams) {
  const params = new URLSearchParams();

  if (limit) {
    params.append("limit", limit.toString());
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`/api/police-data-map?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch map data: ${response.statusText}`);
  }

  return response.json();
}

export function usePoliceDataForMap(
  filters: MapFilters = {},
  limit: number = 5000
) {
  const queryKey = ["policeDataMap", filters, limit];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMapData({ filters, limit }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    filters: query.data?.filters,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export type { MapFilters };
