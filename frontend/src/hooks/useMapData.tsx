import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import {
  MapFilters,
  FetchDataParams,
  ClusterResponse,
  PointResponse,
  MapDataResponse,
} from "../schemas/hookSchemas";

function shouldUseIndividualPoints(zoom: number): boolean {
  return zoom >= 16;
}

async function fetchClusterData({
  filters,
  zoom,
  bbox,
}: FetchDataParams): Promise<ClusterResponse> {
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

async function fetchPointData({
  filters,
  bbox,
}: FetchDataParams): Promise<PointResponse> {
  const params = new URLSearchParams();

  params.append("limit", "5000");

  if (bbox) {
    params.append("bbox", bbox);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.toString().trim()) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/police-data-map?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch point data: ${response.statusText}`);
  }
  return response.json();
}

export function useMapData(initialZoom: number = 10) {
  const [filters, setFilters] = useState<MapFilters>({});
  const [zoom, setZoom] = useState(initialZoom);
  const [bbox, setBbox] = useState<string | undefined>();

  const useIndividualPoints = useMemo(
    () => shouldUseIndividualPoints(zoom),
    [zoom]
  );

  const queryKey = useMemo(
    () => ["mapData", filters, zoom, bbox, useIndividualPoints],
    [filters, zoom, bbox, useIndividualPoints]
  );

  const query = useQuery<MapDataResponse>({
    queryKey,
    queryFn: async (): Promise<MapDataResponse> => {
      if (useIndividualPoints) {
        return await fetchPointData({ filters, zoom, bbox });
      } else {
        return await fetchClusterData({ filters, zoom, bbox });
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const updateFilters = useCallback((newFilters: Partial<MapFilters>) => {
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

  const clusters = useMemo(() => {
    if (useIndividualPoints || !query.data) return [];
    return (query.data as ClusterResponse).clusters || [];
  }, [query.data, useIndividualPoints]);

  const points = useMemo(() => {
    if (!useIndividualPoints || !query.data) return [];
    return (query.data as PointResponse).data || [];
  }, [query.data, useIndividualPoints]);

  const totalPoints = useMemo(() => {
    if (!query.data) return 0;
    if (useIndividualPoints) {
      return (query.data as PointResponse).meta.returned;
    } else {
      return (query.data as ClusterResponse).meta.totalPoints;
    }
  }, [query.data, useIndividualPoints]);

  return {
    // Data
    clusters,
    points,
    useIndividualPoints,

    // Metadata
    meta: query.data?.meta,
    filters,
    zoom,
    bbox,
    totalPoints,

    // State
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    // Actions
    updateFilters,
    clearFilters,
    updateZoom,
    updateBbox,
    updateDateRange,
    refetch: query.refetch,
  };
}
