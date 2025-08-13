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
  ArcElement,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import * as styles from "../styles/pages/analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

  const genderChartData = {
    labels: data.genderStats.map((stat) => stat.category),
    datasets: [
      {
        label: "Number of Records",
        data: data.genderStats.map((stat) => stat.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const ageRangeChartData = {
    labels: data.ageRangeStats.map((stat) => stat.category),
    datasets: [
      {
        label: "Number of Records",
        data: data.ageRangeStats.map((stat) => stat.count),
        backgroundColor: [
          "rgba(139, 69, 19, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(139, 69, 19, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const outcomeChartData = {
    labels: data.outcomeStats.map((stat) => stat.category),
    datasets: [
      {
        label: "Number of Records",
        data: data.outcomeStats.map((stat) => stat.count),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: { parsed: { x: number } }) {
            return `Count: ${tooltipItem.parsed.x.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return Number(value).toLocaleString();
          },
        },
      },
    },
  };

  const searchTypeChartData = {
    labels: data.searchTypeStats.map((stat) => stat.category),
    datasets: [
      {
        label: "Percentage",
        data: data.searchTypeStats.map((stat) => stat.percentage),
        backgroundColor: [
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgba(168, 85, 247, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(14, 165, 233, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: { label: string; parsed: number }) {
            return `${tooltipItem.label}: ${tooltipItem.parsed}%`;
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
          <header className={styles.header}>
            <h1 className={styles.title}>Stop and Search Analytics</h1>
            <p className={styles.subtitle}>
              Overview of stop and search records over time
            </p>
          </header>

          <section aria-labelledby="summary-stats">
            <h2 id="summary-stats" className="sr-only">
              Summary Statistics
            </h2>
            <div className={styles.statsGrid}>
              <div
                className={styles.statCard}
                role="group"
                aria-labelledby="total-stops"
              >
                <div className={styles.statValue} id="total-stops">
                  {data.totalStops.toLocaleString()}
                </div>
                <div className={styles.statLabel}>
                  Total Stop & Search Records
                </div>
              </div>

              <div
                className={styles.statCard}
                role="group"
                aria-labelledby="average-per-month"
              >
                <div className={styles.statValue} id="average-per-month">
                  {data.averagePerMonth.toLocaleString()}
                </div>
                <div className={styles.statLabel}>Average Per Month</div>
              </div>

              <div
                className={styles.statCard}
                role="group"
                aria-labelledby="months-data"
              >
                <div className={styles.statValue} id="months-data">
                  {data.monthlyStats.length}
                </div>
                <div className={styles.statLabel}>Months with Data</div>
              </div>
            </div>
          </section>

          <section aria-labelledby="monthly-trends">
            <div className={styles.chartContainer}>
              <h2 id="monthly-trends" className={styles.chartTitle}>
                Monthly Stop and Search Records
              </h2>
              <p className={styles.chartDescription}>
                Trend of stop and search records over time, showing monthly
                totals
              </p>
              <div
                className={styles.chartWrapper}
                role="img"
                aria-labelledby="monthly-trends"
                aria-describedby="monthly-chart-desc"
              >
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div id="monthly-chart-desc" className="sr-only">
                Bar chart showing {data.monthlyStats.length} months of data from{" "}
                {data.monthlyStats.length > 0
                  ? formatMonthLabel(data.monthlyStats[0].month)
                  : ""}{" "}
                to{" "}
                {data.monthlyStats.length > 0
                  ? formatMonthLabel(
                      data.monthlyStats[data.monthlyStats.length - 1].month
                    )
                  : ""}
              </div>
            </div>
          </section>

          <div className={styles.chartsGrid}>
            <section aria-labelledby="gender-distribution">
              <div className={styles.chartContainer}>
                <h2 id="gender-distribution" className={styles.chartTitle}>
                  Gender Distribution
                </h2>
                <p className={styles.chartDescription}>
                  Breakdown of stop and search records by gender
                </p>
                <div
                  className={styles.smallChartWrapper}
                  role="img"
                  aria-labelledby="gender-distribution"
                  aria-describedby="gender-chart-desc"
                >
                  <Doughnut data={genderChartData} options={pieOptions} />
                </div>
                <div id="gender-chart-desc" className="sr-only">
                  Doughnut chart showing gender distribution:{" "}
                  {data.genderStats
                    .map(
                      (stat) =>
                        `${
                          stat.category
                        }: ${stat.count.toLocaleString()} records (${
                          stat.percentage
                        }%)`
                    )
                    .join(", ")}
                </div>
              </div>
            </section>

            <section aria-labelledby="age-distribution">
              <div className={styles.chartContainer}>
                <h2 id="age-distribution" className={styles.chartTitle}>
                  Age Range Distribution
                </h2>
                <p className={styles.chartDescription}>
                  Breakdown of stop and search records by age range
                </p>
                <div
                  className={styles.smallChartWrapper}
                  role="img"
                  aria-labelledby="age-distribution"
                  aria-describedby="age-chart-desc"
                >
                  <Pie data={ageRangeChartData} options={pieOptions} />
                </div>
                <div id="age-chart-desc" className="sr-only">
                  Pie chart showing age range distribution:{" "}
                  {data.ageRangeStats
                    .map(
                      (stat) =>
                        `${
                          stat.category
                        }: ${stat.count.toLocaleString()} records (${
                          stat.percentage
                        }%)`
                    )
                    .join(", ")}
                </div>
              </div>
            </section>
          </div>

          <div className={styles.chartsGrid}>
            <section aria-labelledby="search-outcomes">
              <div className={styles.chartContainer}>
                <h2 id="search-outcomes" className={styles.chartTitle}>
                  Search Outcomes (Top 10)
                </h2>
                <p className={styles.chartDescription}>
                  Most common outcomes from stop and search procedures
                </p>
                <div
                  className={styles.smallChartWrapper}
                  role="img"
                  aria-labelledby="search-outcomes"
                  aria-describedby="outcome-chart-desc"
                >
                  <Bar data={outcomeChartData} options={horizontalBarOptions} />
                </div>
                <div id="outcome-chart-desc" className="sr-only">
                  Horizontal bar chart showing top 10 search outcomes:{" "}
                  {data.outcomeStats
                    .map(
                      (stat) =>
                        `${
                          stat.category
                        }: ${stat.count.toLocaleString()} records (${
                          stat.percentage
                        }%)`
                    )
                    .join(", ")}
                </div>
              </div>
            </section>

            <section aria-labelledby="search-types">
              <div className={styles.chartContainer}>
                <h2 id="search-types" className={styles.chartTitle}>
                  Search Type Distribution
                </h2>
                <p className={styles.chartDescription}>
                  Types of stop and search procedures performed
                </p>
                <div
                  className={styles.smallChartWrapper}
                  role="img"
                  aria-labelledby="search-types"
                  aria-describedby="search-type-chart-desc"
                >
                  <Doughnut data={searchTypeChartData} options={pieOptions} />
                </div>
                <div id="search-type-chart-desc" className="sr-only">
                  Doughnut chart showing search type distribution:{" "}
                  {data.searchTypeStats
                    .map(
                      (stat) =>
                        `${
                          stat.category
                        }: ${stat.count.toLocaleString()} records (${
                          stat.percentage
                        }%)`
                    )
                    .join(", ")}
                </div>
              </div>
            </section>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
