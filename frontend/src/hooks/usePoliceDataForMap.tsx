import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { z } from "zod";

const MapFiltersSchema = z.object({
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
});

type MapFilters = z.infer<typeof MapFiltersSchema>;

type FetchMapDataParams = {
  filters: MapFilters;
  limit?: number;
};

async function fetchMapData({ filters, limit }: FetchMapDataParams) {
  const params = new URLSearchParams();

  if (limit !== undefined) {
    params.append("limit", limit.toString());
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.toString().trim()) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/police-data-map?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch map data: ${response.statusText}`);
  }

  return response.json();
}

export function usePoliceDataForMap(initialLimit?: number) {
  const [filters, setFilters] = useState<MapFilters>({});
  const [limit, setLimit] = useState<number | undefined>(initialLimit);

  const queryKey = useMemo(
    () => ["policeDataMap", filters, limit],
    [filters, limit]
  );

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMapData({ filters, limit }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const updateFilters = useCallback((newFilters: Partial<MapFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateBbox = useCallback((bbox: string) => {
    setFilters((prev) => ({ ...prev, bbox }));
  }, []);

  const updateDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }));
  }, []);

  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    filters,
    limit,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    updateFilters,
    clearFilters,
    updateBbox,
    updateDateRange,
    setLimit,
    refetch: query.refetch,
  };
}

export type { MapFilters };
