import { useEffect, useRef, useCallback } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { FeatureLike } from "ol/Feature";
import "ol/ol.css";
import {
  usePoliceDataClusters,
  ClusterData,
} from "@/hooks/usePoliceDataClusters";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {
  MapContainerProps,
  MapContainerPropsSchema,
} from "../../schemas/mapSchemas";
import FloatingFilterPanel from "./FloatingFilterPanel";
import * as styles from "./MapContainer.css";

export default function MapContainer(props: MapContainerProps) {
  const { centre, zoom: initialZoom } = MapContainerPropsSchema.parse(props);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);

  // Use the hook for ALL data management
  const clusterData = usePoliceDataClusters(initialZoom);
  const {
    clusters,
    isLoading,
    isFetching,
    error,
    filters,
    totalPoints,
    updateFilters,
    clearFilters,
    updateZoom,
  } = clusterData;

  // Ref to always have the latest updateZoom function
  const updateZoomRef = useRef(updateZoom);

  // Keep ref current whenever updateZoom changes
  useEffect(() => {
    updateZoomRef.current = updateZoom;
  }, [updateZoom]);

  // Function to update map visual layers
  const updateMapWithClusters = useCallback((newClusters: ClusterData[]) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing layer
    if (vectorLayerRef.current) {
      map.removeLayer(vectorLayerRef.current);
    }

    if (!newClusters.length) return;

    // Create features from clusters
    const features = newClusters.map((cluster: ClusterData) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([cluster.cluster_lng, cluster.cluster_lat])
        ),
        clusterData: cluster,
      });
      return feature;
    });

    const vectorSource = new VectorSource({ features });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature: FeatureLike) => {
        const clusterData = feature.get("clusterData") as ClusterData;
        const size = clusterData.point_count;

        if (size === 1) {
          return new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: "rgba(255, 0, 0, 0.7)" }),
              stroke: new Stroke({
                color: "rgba(255, 255, 255, 0.8)",
                width: 2,
              }),
            }),
          });
        }

        const radius = Math.min(Math.max(10 + size / 20, 15), 40);
        const opacity = Math.min(0.8, 0.4 + size / 100);

        return new Style({
          image: new CircleStyle({
            radius: radius,
            fill: new Fill({ color: `rgba(255, 0, 0, ${opacity})` }),
            stroke: new Stroke({ color: "rgba(255, 255, 255, 0.8)", width: 2 }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({ color: "#fff" }),
            font: "bold 12px Arial",
          }),
        });
      },
    });

    vectorLayerRef.current = vectorLayer;
    map.addLayer(vectorLayer);
  }, []);

  // SEPARATE EFFECT 1: Map initialization - TRULY ONCE ONLY
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(centre),
        zoom: initialZoom,
        constrainResolution: true,
      }),
      controls: [],
    });

    mapInstanceRef.current = map;

    // Handle zoom changes - use the ref to access latest updateZoom
    let zoomTimeout: NodeJS.Timeout;
    map.getView().on("change:resolution", () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        const newZoom = Math.round(map.getView().getZoom() || initialZoom);

        // Use ref to always get latest updateZoom function
        updateZoomRef.current(newZoom);
      }, 300);
    });

    return () => {
      clearTimeout(zoomTimeout);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initialize only once - ignore centre/initialZoom dependencies

  // SEPARATE EFFECT 2: Handle centre changes without recreating map
  useEffect(() => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.setCenter(fromLonLat(centre));
    }
  }, [centre]);

  // SEPARATE EFFECT 3: Data updates - when hook provides new clusters
  useEffect(() => {
    if (clusters && clusters.length > 0) {
      updateMapWithClusters(clusters);
    }
  }, [clusters, updateMapWithClusters]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {isLoading && (
        <div className={styles.overlayContainer}>
          <div className={styles.loadingMessage}>
            <span>Loading map data...</span>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.overlayContainer}>
          <div className={styles.errorMessage}>
            <strong>Error loading map data:</strong> {error.message}
          </div>
        </div>
      )}
      <div ref={mapRef} className={styles.mapContainer} />
      <FloatingFilterPanel
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        isLoading={isFetching}
        totalCount={totalPoints}
      />
    </div>
  );
}
