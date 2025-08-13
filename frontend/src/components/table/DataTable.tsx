import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
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
  pagination: {
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
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSort: (sort: PoliceDataSort) => void;
  currentSort: PoliceDataSort;
  onFilter: (filters: Partial<PoliceDataFilters>) => void;
  currentFilters: PoliceDataFilters;
};

const columnHelper = createColumnHelper<StopSearchRecord>();

const columns = [
  columnHelper.accessor("datetime", {
    header: "Date & Time",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
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
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setSorting([
      {
        id: currentSort.field,
        desc: currentSort.direction === "desc",
      },
    ]);
  }, [currentSort]);

  useEffect(() => {
    setSearchInput(currentFilters.search || "");
  }, [currentFilters.search]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      if (newSorting.length > 0) {
        const sort = newSorting[0];
        onSort({
          field: sort.id,
          direction: sort.desc ? "desc" : "asc",
        });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== currentFilters.search) {
        onFilter({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, onFilter, currentFilters.search]);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <label htmlFor="data-table-search" className={styles.searchLabel}>
          Search all records
        </label>
        <input
          id="data-table-search"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search all records..."
          className={styles.searchInput}
          aria-describedby="search-description"
        />
        <div id="search-description" className={styles.visuallyHidden}>
          Search through all police stop and search records. Results will update automatically as you type.
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table 
          className={styles.table}
          role="table"
          aria-label="Police stop and search records"
          aria-describedby="table-description"
        >
          <caption id="table-description" className={styles.visuallyHidden}>
            Table showing police stop and search records with sortable columns. 
            Use the search box above to filter results. 
            Navigate between pages using the pagination controls below.
          </caption>
          <thead className={styles.tableHead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} role="row">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  let headerClassName = styles.headerCell;
                  if (canSort && isSorted) {
                    headerClassName = styles.sortedHeader;
                  } else if (canSort) {
                    headerClassName = styles.sortableHeader;
                  }

                  const headerContent = flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  );

                  const sortIcon = isSorted === "asc"
                    ? " ↑"
                    : isSorted === "desc"
                    ? " ↓"
                    : canSort
                    ? " ↕"
                    : "";

                  return (
                    <th
                      key={header.id}
                      className={headerClassName}
                      role="columnheader"
                      scope="col"
                      aria-sort={
                        isSorted === "asc" ? "ascending" :
                        isSorted === "desc" ? "descending" :
                        canSort ? "none" : undefined
                      }
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={styles.sortButton}
                          aria-label={`Sort by ${headerContent}${
                            isSorted === "asc" ? " (currently ascending)" :
                            isSorted === "desc" ? " (currently descending)" :
                            " (not sorted)"
                          }`}
                        >
                          <span>{headerContent}</span>
                          <span aria-hidden="true">{sortIcon}</span>
                        </button>
                      ) : (
                        <span>{headerContent}</span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody role="rowgroup">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={`loading-${index}`} className={styles.tableRow} role="row">
                  {columns.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className={styles.tableCell}
                      style={{ opacity: 0.5 }}
                      role="cell"
                    >
                      Loading...
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className={styles.tableRow} role="row">
                <td
                  colSpan={columns.length}
                  className={styles.tableCell}
                  style={{ textAlign: "center", padding: "2rem" }}
                  role="cell"
                >
                  {currentFilters.search
                    ? `No results found for "${currentFilters.search}"`
                    : "No data available"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.tableRow} role="row">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.tableCell} role="cell">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo} aria-live="polite">
          Showing{" "}
          {pagination.currentPageRecords > 0
            ? (pagination.current.page - 1) * pagination.current.pageSize + 1
            : 0}{" "}
          to{" "}
          {(pagination.current.page - 1) * pagination.current.pageSize +
            pagination.currentPageRecords}{" "}
          of{" "}
          {pagination.total > 0 ? pagination.total.toLocaleString() : "unknown"}{" "}
          entries
          {currentFilters.search && ` (filtered)`}
        </div>

        <nav className={styles.paginationControls} aria-label="Table pagination">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!pagination.hasPreviousPage}
            className={
              pagination.hasPreviousPage
                ? styles.paginationButton
                : styles.paginationButtonDisabled
            }
            aria-label="Go to first page"
          >
            {"<<"}
          </button>
          <button
            type="button"
            onClick={() => onPageChange(pagination.current.page - 1)}
            disabled={!pagination.hasPreviousPage}
            className={
              pagination.hasPreviousPage
                ? styles.paginationButton
                : styles.paginationButtonDisabled
            }
            aria-label="Go to previous page"
          >
            {"<"}
          </button>

          <span className={styles.pageInfo} aria-current="page">
            Page{" "}
            <strong className={styles.pageInfoStrong}>
              {pagination.current.page} of{" "}
              {pagination.totalPages > 0 ? pagination.totalPages : "?"}
            </strong>
          </span>

          <button
            type="button"
            onClick={() => onPageChange(pagination.current.page + 1)}
            disabled={!pagination.hasNextPage}
            className={
              pagination.hasNextPage
                ? styles.paginationButton
                : styles.paginationButtonDisabled
            }
            aria-label="Go to next page"
          >
            {">"}
          </button>
          <button
            type="button"
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage || pagination.totalPages <= 0}
            className={
              pagination.hasNextPage && pagination.totalPages > 0
                ? styles.paginationButton
                : styles.paginationButtonDisabled
            }
            aria-label="Go to last page"
          >
            {">>"}
          </button>
        </nav>
      </div>
    </div>
  );
}
