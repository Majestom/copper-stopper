import Head from "next/head";
import MainLayout from "../components/layout/MainLayout";
import { useBasicPoliceData } from "../hooks/useBasicPoliceData";
import { StopSearchRecord } from "@/schemas/dbSchemas";

export default function TablePage() {
  const { data, isLoading, error } = useBasicPoliceData();
  return (
    <>
      <Head>
        <title>Police Data Visualization - Table View</title>
        <meta
          name="description"
          content="Police stop and search data in table format"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div>
          <h1
            style={{
              marginBottom: "20px",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Police Stop & Search Data - Table View
          </h1>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Tabular view of police stop and search data with sorting and
            filtering
          </p>

          <div
            style={{
              width: "100%",
              height: "calc(100vh - 160px)",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "#666",
            }}
          >
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data &&
              data.data.map((record: StopSearchRecord) => (
                <div key={record.id} style={{ margin: "10px" }}>
                  <p>
                    <strong>Date:</strong> {record.datetime}
                  </p>
                  <p>
                    <strong>Type:</strong> {record.type || "N/A"}
                  </p>
                  <p>
                    <strong>Age Range:</strong> {record.age_range || "N/A"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {record.gender || "N/A"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
