import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

export type PoliceDataFilters = {
  search?: string;
  type?: string;
  gender?: string;
  ageRange?: string;
  outcome?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type PoliceDataSort = {
  field: string;
  direction: "asc" | "desc";
};

export type PoliceDataPagination = {
  page: number;
  pageSize: number;
};

type FetchPoliceDataParams = {
  pagination: PoliceDataPagination;
  filters?: PoliceDataFilters;
  sort?: PoliceDataSort;
};

async function fetchPoliceData({
  pagination,
  filters,
  sort,
}: FetchPoliceDataParams) {
  const params = new URLSearchParams();

  params.append("page", pagination.page.toString());
  params.append("pageSize", pagination.pageSize.toString());

  if (sort) {
    params.append("sortField", sort.field);
    params.append("sortDirection", sort.direction);
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`/api/police-data?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

export function usePoliceData(initialPageSize: number = 100) {
  const [pagination, setPagination] = useState<PoliceDataPagination>({
    page: 1,
    pageSize: initialPageSize,
  });

  const [filters, setFilters] = useState<PoliceDataFilters>({});
  const [sort, setSort] = useState<PoliceDataSort>({
    field: "datetime",
    direction: "desc",
  });

  const queryKey = useMemo(
    () => ["policeData", pagination, filters, sort],
    [pagination, filters, sort]
  );

  const query = useQuery({
    queryKey,
    queryFn: () => fetchPoliceData({ pagination, filters, sort }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const updatePagination = (newPagination: Partial<PoliceDataPagination>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  const updateFilters = (newFilters: Partial<PoliceDataFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const updateSort = (newSort: PoliceDataSort) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const changePageSize = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  const totalPages = query.data?.pagination?.totalPages || 0;
  const totalRecords = query.data?.pagination?.total || 0;
  const currentPageRecords = query.data?.data?.length || 0;
  const hasNextPage = query.data?.pagination?.hasNext || false;
  const hasPreviousPage = query.data?.pagination?.hasPrevious || false;

  return {
    data: query.data?.data || [],
    pagination: {
      current: pagination,
      total: totalRecords,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      currentPageRecords,
    },
    filters,
    sort,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    updatePagination,
    updateFilters,
    updateSort,
    clearFilters,
    goToPage,
    changePageSize,

    refetch: query.refetch,
  };
}
