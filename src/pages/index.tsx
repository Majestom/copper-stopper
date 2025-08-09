import Head from "next/head";
import MapContainer from "../components/map/MapContainer";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Police Data Map</title>
        <meta
          name="description"
          content="Police stop and search data visualisation"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <MapContainer
          width="100%"
          height="600px"
          centre={[-0.1278, 51.5074]}
          zoom={10}
        />
      </MainLayout>
    </>
  );
}
