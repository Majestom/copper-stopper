import Head from "next/head";
import MapContainer from "../components/map/MapContainer";

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
      <main>
        <h1>Police Stop and Search Data Map</h1>
        <p>
          This map visualises police stop and search data by the London
          Metropolitan Police. Use the controls to filter by date, location, and
          type of search.
        </p>
        <MapContainer
          width="100%"
          height="600px"
          centre={[-0.1278, 51.5074]}
          zoom={10}
        />
      </main>
    </>
  );
}
