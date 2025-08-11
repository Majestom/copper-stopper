import Head from "next/head";
import MainLayout from "../components/layout/MainLayout";
import { usePoliceData } from "../hooks/usePoliceData";
import DataTable from "../components/table/DataTable";
import * as styles from "../styles/pages/table.css";

export default function TablePage() {
  const {
    data,
    pagination,
    filters,
    sort,
    isLoading,
    isFetching,
    error,
    updateFilters,
    updateSort,
    clearFilters,
    goToPage,
    changePageSize,
  } = usePoliceData(100);

  const recordsPercentage =
    pagination.total > 0
      ? ((pagination.currentPageRecords / pagination.total) * 100).toFixed(1)
      : "0";

  return (
    <>
      <Head>
        <title>Police Data - Table View</title>
        <meta
          name="description"
          content="Police stop and search data in table format with advanced filtering and sorting"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className={styles.lightModeWrapper}>
          <div className={styles.pageContainer}>
            <header className={styles.header}>
              <h1 className={styles.title}>Stop & Search Records</h1>
            </header>

            {error && (
              <div className={styles.errorAlert}>
                <strong>⚠️ Error loading data:</strong> {error.message}
                <br />
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  Please try refreshing the page or contact support if the issue
                  persists.
                </span>
              </div>
            )}

            {isLoading && (
              <div className={styles.statsCard}>
                <div className={styles.statsIcon}>⏳</div>
                <div className={styles.statsContent}>
                  <div className={styles.statsTitle}>Loading Data</div>
                  <div className={styles.statsValue}>Please wait...</div>
                  <div className={styles.statsSubtext}>Fetching records...</div>
                </div>
              </div>
            )}

            {!isLoading && (
              <div className={styles.statsCard}>
                <div className={styles.statsIcon}>
                  {isFetching ? "🔄" : "📊"}
                </div>
                <div className={styles.statsContent}>
                  <div className={styles.statsTitle}>
                    Dataset Overview
                    {isFetching && (
                      <span
                        style={{ fontSize: "0.75rem", marginLeft: "0.5rem" }}
                      >
                        (Updating...)
                      </span>
                    )}
                  </div>
                  <div className={styles.statsValue}>
                    {pagination.currentPageRecords.toLocaleString()}
                    <span> records on page {pagination.current.page}</span>
                  </div>
                  <div className={styles.statsSubtext}>
                    from {pagination.total.toLocaleString()} total records
                    <span>
                      {" "}
                      (Page {pagination.current.page} of {pagination.totalPages}
                      )
                    </span>
                  </div>
                </div>
              </div>
            )}

            {Object.values(filters).some(Boolean) && (
              <div className={styles.successAlert}>
                <strong>🔍 Active Filters:</strong>
                {filters.search && ` Search: "${filters.search}"`}
                {filters.type && ` Type: ${filters.type}`}
                {filters.gender && ` Gender: ${filters.gender}`}
                {filters.outcome && ` Outcome: ${filters.outcome}`}{" "}
                <button
                  onClick={clearFilters}
                  style={{
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}

            <section className={styles.tableSection}>
              <div className={styles.tableHeader}>
                <h2 className={styles.tableSectionTitle}>
                  Records Explorer
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "normal",
                      marginLeft: "1rem",
                    }}
                  >
                    {pagination.current.pageSize} per page
                  </span>
                </h2>
                <p className={styles.tableSectionSubtitle}>
                  Click headers to sort, use search to filter data.
                  {pagination.totalPages > 1 &&
                    ` Navigate through ${pagination.totalPages} pages of results.`}
                </p>
              </div>

              <div className={styles.tableContent}>
                <DataTable
                  data={data}
                  isLoading={isLoading}
                  pagination={pagination}
                  onPageChange={goToPage}
                  onPageSizeChange={changePageSize}
                  onSort={updateSort}
                  currentSort={sort}
                  onFilter={updateFilters}
                  currentFilters={filters}
                />
              </div>
            </section>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
