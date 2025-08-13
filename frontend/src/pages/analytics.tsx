import Head from "next/head";
import MainLayout from "../components/layout/MainLayout";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import * as styles from "../styles/pages/analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { data, isLoading, error } = useAnalyticsData();

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Police Data - Analytics</title>
          <meta
            name="description"
            content="Police stop and search data analytics and insights"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout>
          <div className={styles.analyticsContainer}>
            <div className={styles.loadingContainer}>
              Loading analytics data...
            </div>
          </div>
        </MainLayout>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Police Data - Analytics</title>
          <meta
            name="description"
            content="Police stop and search data analytics and insights"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout>
          <div className={styles.analyticsContainer}>
            <div className={styles.errorContainer}>
              Error loading analytics data. Please try again later.
            </div>
          </div>
        </MainLayout>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Head>
          <title>Police Data - Analytics</title>
          <meta
            name="description"
            content="Police stop and search data analytics and insights"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout>
          <div className={styles.analyticsContainer}>
            <div className={styles.errorContainer}>
              No analytics data available.
            </div>
          </div>
        </MainLayout>
      </>
    );
  }

  const formatMonthLabel = (monthString: string): string => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const chartData = {
    labels: data.monthlyStats.map((stat) => formatMonthLabel(stat.month)),
    datasets: [
      {
        label: "Stop and Search Records",
        data: data.monthlyStats.map((stat) => stat.count),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: {
            dataset: { label?: string };
            parsed: { y: number };
          }) {
            const label = tooltipItem.dataset.label || "";
            return `${label}: ${tooltipItem.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return Number(value).toLocaleString();
          },
        },
      },
    },
  };

  return (
    <>
      <Head>
        <title>Police Data - Analytics</title>
        <meta
          name="description"
          content="Police stop and search data analytics and insights"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <div className={styles.analyticsContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Stop and Search Analytics</h1>
            <p className={styles.subtitle}>
              Overview of stop and search records over time
            </p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {data.totalStops.toLocaleString()}
              </div>
              <div className={styles.statLabel}>
                Total Stop & Search Records
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {data.averagePerMonth.toLocaleString()}
              </div>
              <div className={styles.statLabel}>Average Per Month</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{data.monthlyStats.length}</div>
              <div className={styles.statLabel}>Months with Data</div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>
              Monthly Stop and Search Records
            </h2>
            <div className={styles.chartWrapper}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
