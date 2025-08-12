import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { FeatureLike } from "ol/Feature";
import "ol/ol.css";
import { usePoliceDataForMap } from "@/hooks/usePoliceDataForMap";
import { StopSearchRecord } from "@/schemas/dbSchemas";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Cluster from "ol/source/Cluster";
import {
  MapContainerProps,
  MapContainerPropsSchema,
} from "../../schemas/mapSchemas";
import FloatingFilterPanel from "./FloatingFilterPanel";
import * as styles from "./MapContainer.css";

function getClusterDistance(zoom: number): number {
  if (zoom <= 10) return 100;
  if (zoom <= 12) return 60;
  if (zoom <= 14) return 40;
  if (zoom >= 17) return 10;
  return 0;
}

function getClusterStyle(feature: FeatureLike, _resolution: number) {
  const features = feature.get("features") as Feature[];
  const size = features.length;

  if (size === 1) {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.7)",
        }),
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 0.8)",
          width: 2,
        }),
      }),
    });
  }

  const radius = Math.min(Math.max(10 + size / 5, 15), 30);
  const opacity = Math.min(0.8, 0.4 + size / 50);

  return new Style({
    image: new CircleStyle({
      radius: radius,
      fill: new Fill({
        color: `rgba(255, 0, 0, ${opacity})`,
      }),
      stroke: new Stroke({
        color: "rgba(255, 255, 255, 0.8)",
        width: 2,
      }),
    }),
    text: new Text({
      text: size.toString(),
      fill: new Fill({
        color: "#fff",
      }),
      font: "bold 12px Arial",
    }),
  });
}

export default function MapContainer(props: MapContainerProps) {
  const { centre, zoom } = MapContainerPropsSchema.parse(props);

  const mapData = usePoliceDataForMap(8000);
  const {
    data: policeData,
    isLoading,
    isFetching,
    error,
    filters,
    updateFilters,
    clearFilters,
  } = mapData;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);
  const clusterSourceRef = useRef<Cluster | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(centre),
        zoom,
      }),
      controls: [],
    });

    mapInstanceRef.current = map;

    map.getView().on("change:resolution", () => {
      const currentZoom = map.getView().getZoom() || 10;
      if (clusterSourceRef.current) {
        clusterSourceRef.current.setDistance(getClusterDistance(currentZoom));
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [centre, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || !policeData) return;

    const map = mapInstanceRef.current;

    if (vectorLayerRef.current) {
      map.removeLayer(vectorLayerRef.current);
    }

    if (isLoading || error || !policeData.length) return;

    const features = policeData
      .filter((record: StopSearchRecord) => record.latitude && record.longitude)
      .map((record: StopSearchRecord) => {
        if (record.latitude !== null && record.longitude !== null) {
          const feature = new Feature({
            geometry: new Point(
              fromLonLat([record.longitude, record.latitude])
            ),
            properties: {
              id: record.id,
              datetime: record.datetime,
              type: record.type,
              age_range: record.age_range,
              gender: record.gender,
              outcome: record.outcome,
              street_name: record.street_name,
            },
          });

          return feature;
        }
        return null;
      })
      .filter((f: Feature | null): f is Feature => f !== null);

    const vectorSource = new VectorSource({
      features,
    });

    const currentZoom = map.getView().getZoom() || 10;
    const clusterSource = new Cluster({
      distance: getClusterDistance(currentZoom),
      source: vectorSource,
    });

    clusterSourceRef.current = clusterSource;

    const vectorLayer = new VectorLayer({
      source: clusterSource,
      style: getClusterStyle,
    });

    vectorLayerRef.current = vectorLayer;
    map.addLayer(vectorLayer);

    map.on("click", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const features = feature.get("features");
        if (features?.length > 1) {
          console.log(
            "Cluster details:",
            features.map((f: Feature) => f.get("properties"))
          );
        } else if (features?.length === 1) {
          const singleFeature = features[0];
          const properties = singleFeature.get("properties");
          console.log("Single feature details:", properties);
        }
      });
    });
  }, [policeData, error, isLoading]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {isLoading && (
        <div>
          <span>Loading map data...</span>
        </div>
      )}

      {error && (
        <div>
          <strong>Error loading map data:</strong> {error.message}
          <br />
        </div>
      )}
      <div ref={mapRef} className={styles.mapContainer} />
      <FloatingFilterPanel
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        isLoading={isFetching}
        totalCount={policeData.length}
      />
    </div>
  );
}
