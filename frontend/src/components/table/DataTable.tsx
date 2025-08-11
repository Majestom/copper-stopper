import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { StopSearchRecord } from "@/schemas/dbSchemas";
import * as styles from "./DataTable.css";

interface DataTableProps {
  data: StopSearchRecord[];
  isLoading?: boolean;
}

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

export default function DataTable({ data, isLoading }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
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
      </div>
    </div>
  );
}
