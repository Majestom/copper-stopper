import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { StopSearchRecord } from "@/schemas/dbSchemas";
import { PoliceDataFilters, PoliceDataSort } from "@/hooks/usePoliceData";
import * as styles from "./DataTable.css";

type DataTableProps = {
  data: StopSearchRecord[];
  isLoading?: boolean;
  pagination?: {
    current: {
      page: number;
      pageSize: number;
    };
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    currentPageRecords: number;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSort?: (sort: PoliceDataSort) => void;
  currentSort?: PoliceDataSort;
  onFilter?: (filters: Partial<PoliceDataFilters>) => void;
  currentFilters?: PoliceDataFilters;
};

const columnHelper = createColumnHelper<StopSearchRecord>();

const columns = [
  columnHelper.accessor("datetime", {
    header: "Date & Time",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    sortingFn: "datetime",
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor("age_range", {
    header: "Age Range",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor("outcome", {
    header: "Outcome",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor("object_of_search", {
    header: "Object of Search",
    cell: (info) => info.getValue() || "N/A",
  }),
  columnHelper.accessor(
    (row) => (row.latitude && row.longitude ? "Yes" : "No"),
    {
      id: "has_location",
      header: "Has Location",
      enableSorting: false,
    }
  ),
];

export default function DataTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onSort,
  currentSort,
  onFilter,
  currentFilters,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const isServerSide = Boolean(pagination && onPageChange);

  useEffect(() => {
    if (currentSort) {
      setSorting([
        {
          id: currentSort.field,
          desc: currentSort.direction === "desc",
        },
      ]);
    }
  }, [currentSort]);

  useEffect(() => {
    if (currentFilters?.search !== undefined) {
      setGlobalFilter(currentFilters.search);
    }
  }, [currentFilters?.search]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      if (isServerSide && onSort && newSorting.length > 0) {
        const sort = newSorting[0];
        onSort({
          field: sort.id,
          direction: sort.desc ? "desc" : "asc",
        });
      }
    },
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);

      if (isServerSide && onFilter) {
        onFilter({ search: value });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(isServerSide
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          initialState: {
            pagination: { pageSize: 20 },
          },
        }),
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    manualPagination: isServerSide,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading table data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all records..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  let headerClassName = styles.headerCell;
                  if (canSort && isSorted) {
                    headerClassName = styles.sortedHeader;
                  } else if (canSort) {
                    headerClassName = styles.sortableHeader;
                  }

                  return (
                    <th
                      key={header.id}
                      className={headerClassName}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {isSorted === "asc"
                        ? " ↑"
                        : isSorted === "desc"
                        ? " ↓"
                        : canSort
                        ? " ↕"
                        : ""}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tableRow}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.tableCell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        {isServerSide && pagination ? (
          <>
            <div className={styles.paginationInfo}>
              Showing{" "}
              {pagination.currentPageRecords > 0
                ? (pagination.current.page - 1) * pagination.current.pageSize +
                  1
                : 0}{" "}
              to{" "}
              {(pagination.current.page - 1) * pagination.current.pageSize +
                pagination.currentPageRecords}{" "}
              of {pagination.total.toLocaleString()} entries
              {globalFilter && ` (filtered)`}
            </div>

            <div className={styles.paginationControls}>
              <button
                onClick={() => onPageChange?.(1)}
                disabled={!pagination.hasPreviousPage}
                className={
                  pagination.hasPreviousPage
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {"<<"}
              </button>
              <button
                onClick={() => onPageChange?.(pagination.current.page - 1)}
                disabled={!pagination.hasPreviousPage}
                className={
                  pagination.hasPreviousPage
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {"<"}
              </button>

              <span className={styles.pageInfo}>
                Page{" "}
                <strong className={styles.pageInfoStrong}>
                  {pagination.current.page} of {pagination.totalPages}
                </strong>
              </span>

              <button
                onClick={() => onPageChange?.(pagination.current.page + 1)}
                disabled={!pagination.hasNextPage}
                className={
                  pagination.hasNextPage
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {">"}
              </button>
              <button
                onClick={() => onPageChange?.(pagination.totalPages)}
                disabled={!pagination.hasNextPage}
                className={
                  pagination.hasNextPage
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {">>"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.paginationInfo}>
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getPrePaginationRowModel().rows.length
              )}{" "}
              of {table.getPrePaginationRowModel().rows.length} entries
              {globalFilter && ` (filtered from ${data.length} total)`}
            </div>

            <div className={styles.paginationControls}>
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className={
                  table.getCanPreviousPage()
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={
                  table.getCanPreviousPage()
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {"<"}
              </button>

              <span className={styles.pageInfo}>
                Page{" "}
                <strong className={styles.pageInfoStrong}>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={
                  table.getCanNextPage()
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className={
                  table.getCanNextPage()
                    ? styles.paginationButton
                    : styles.paginationButtonDisabled
                }
              >
                {">>"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
