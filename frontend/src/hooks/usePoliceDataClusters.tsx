import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { z } from "zod";

const ClusterFiltersSchema = z.object({
  type: z.string().optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  outcome: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

type ClusterFilters = z.infer<typeof ClusterFiltersSchema>;

interface ClusterData {
  cluster_lat: number;
  cluster_lng: number;
  point_count: number;
  bounds_min_lat: number;
  bounds_max_lat: number;
  bounds_min_lng: number;
  bounds_max_lng: number;
}

interface ClusterResponse {
  clusters: ClusterData[];
  meta: {
    zoom: number;
    precision: number;
    clusterCount: number;
    pointsRepresented: number;
    totalPoints: number;
    bbox?: string;
    queryType: string;
  };
  filters: ClusterFilters;
}

type FetchClusterDataParams = {
  filters: ClusterFilters;
  zoom: number;
  bbox?: string;
};

async function fetchClusterData({
  filters,
  zoom,
  bbox,
}: FetchClusterDataParams): Promise<ClusterResponse> {
  const params = new URLSearchParams();

  params.append("zoom", zoom.toString());

  if (bbox) {
    params.append("bbox", bbox);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.toString().trim()) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(
    `/api/police-data-clusters?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch cluster data: ${response.statusText}`);
  }

  return response.json();
}

export function usePoliceDataClusters(initialZoom: number = 10) {
  const [filters, setFilters] = useState<ClusterFilters>({});
  const [zoom, setZoom] = useState(initialZoom);
  const [bbox, setBbox] = useState<string | undefined>();

  const queryKey = useMemo(
    () => ["policeDataClusters", filters, zoom, bbox],
    [filters, zoom, bbox]
  );

  const query = useQuery({
    queryKey,
    queryFn: () => fetchClusterData({ filters, zoom, bbox }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const updateFilters = useCallback((newFilters: Partial<ClusterFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const updateBbox = useCallback((newBbox: string) => {
    setBbox(newBbox);
  }, []);

  const updateDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }));
  }, []);

  return {
    clusters: query.data?.clusters || [],
    meta: query.data?.meta,
    filters,
    zoom,
    bbox,

    totalPoints: query.data?.meta?.totalPoints || 0,
    pointsRepresented: query.data?.meta?.pointsRepresented || 0,
    clusterCount: query.data?.meta?.clusterCount || 0,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    updateFilters,
    clearFilters,
    updateZoom,
    updateBbox,
    updateDateRange,
    refetch: query.refetch,
  };
}

export type { ClusterFilters, ClusterData };
