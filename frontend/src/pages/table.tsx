import Head from "next/head";
import MainLayout from "../components/layout/MainLayout";
import { useBasicPoliceData } from "../hooks/useBasicPoliceData";
import DataTable from "../components/table/DataTable";
import * as styles from "../styles/pages/table.css";

export default function TablePage() {
  const { data, isLoading, error } = useBasicPoliceData();

  const totalRecords = data?.pagination?.total || 0;
  const currentPageRecords = data?.data?.length || 0;
  const recordsPercentage =
    totalRecords > 0
      ? ((currentPageRecords / totalRecords) * 100).toFixed(1)
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
        <div className={styles.pageContainer}>
          <header className={styles.header}>
            <h1 className={styles.title}>Police Stop & Search Data</h1>
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
                <div className={styles.statsSubtext}>
                  Fetching police stop and search records
                </div>
              </div>
            </div>
          )}

          {data && !isLoading && (
            <div className={styles.statsCard}>
              <div className={styles.statsIcon}>📊</div>
              <div className={styles.statsContent}>
                <div className={styles.statsTitle}>Dataset Overview</div>
                <div className={styles.statsValue}>
                  {currentPageRecords.toLocaleString()}
                  <span>records displayed</span>
                </div>
                <div className={styles.statsSubtext}>
                  from {totalRecords.toLocaleString()} total records
                  <span> ({recordsPercentage}% of dataset)</span>
                </div>
              </div>
            </div>
          )}

          <section className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableSectionTitle}>
                Stop & Search Records
              </h2>
              <p className={styles.tableSectionSubtitle}>
                Interactive table with sorting, filtering, and pagination. Click
                column headers to sort, use the search box to filter across all
                fields.
              </p>
            </div>

            <div className={styles.tableContent}>
              <DataTable data={data?.data || []} isLoading={isLoading} />
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
}
