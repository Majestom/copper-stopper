import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { FeatureLike } from "ol/Feature";
import "ol/ol.css";
import { useMapData, ClusterData, PointData } from "@/hooks/useMapData";
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
import { StopSearchPopup } from "./StopSearchPopup";
import * as styles from "./MapContainer.css";

export default function MapContainer(props: MapContainerProps) {
  const { centre, zoom: initialZoom } = MapContainerPropsSchema.parse(props);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const popupContainerRef = useRef<HTMLDivElement | null>(null);
  const centreRef = useRef(centre);
  const initialZoomRef = useRef(initialZoom);
  const isUserInteractionRef = useRef(false);

  const [popupData, setPopupData] = useState<PointData | null>(null);
  const [popupCoordinate, setPopupCoordinate] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (!popupContainerRef.current) {
      popupContainerRef.current = document.createElement("div");
      popupContainerRef.current.style.cssText = `
        position: absolute;
        pointer-events: auto;
        z-index: 1000;
      `;
    }

    return () => {
      if (popupContainerRef.current && popupContainerRef.current.parentNode) {
        popupContainerRef.current.parentNode.removeChild(
          popupContainerRef.current
        );
      }
    };
  }, []);

  const closePopup = useCallback(() => {
    setPopupData(null);
    setPopupCoordinate(null);

    if (overlayRef.current && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.removeOverlay(overlayRef.current);
      } catch (error) {
        console.warn("Error removing overlay:", error);
      }
      overlayRef.current = null;
    }
  }, []);

  const openPopup = useCallback(
    (data: PointData, coordinate: [number, number]) => {
      setPopupData(data);
      setPopupCoordinate(coordinate);
    },
    []
  );

  useEffect(() => {
    centreRef.current = centre;
  }, [centre]);

  useEffect(() => {
    initialZoomRef.current = initialZoom;
  }, [initialZoom]);

  const mapData = useMapData(initialZoom);
  const {
    clusters,
    points,
    useIndividualPoints,
    isFetching,
    isLoading,
    error,
    filters,
    totalPoints,
    updateFilters,
    clearFilters,
    updateZoom,
    updateBbox,
  } = mapData;

  const calculateBoundingBox = useCallback((map: Map): string | undefined => {
    try {
      const view = map.getView();
      const extent = view.calculateExtent(map.getSize());
      if (!extent) return undefined;

      const [minX, minY, maxX, maxY] = extent;
      const [minLng, minLat] = toLonLat([minX, minY]);
      const [maxLng, maxLat] = toLonLat([maxX, maxY]);

      return `${minLng},${minLat},${maxLng},${maxLat}`;
    } catch (error) {
      console.warn("Failed to calculate bounding box:", error);
      return undefined;
    }
  }, []);

  const updateBoundingBox = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const bbox = calculateBoundingBox(mapInstanceRef.current);
    if (bbox) {
      updateBbox(bbox);
    }
  }, [calculateBoundingBox, updateBbox]);

  const updateMapWithData = useCallback(
    (
      newClusters: ClusterData[],
      newPoints: PointData[],
      isIndividualPoints: boolean
    ) => {
      if (!mapInstanceRef.current) return;

      const map = mapInstanceRef.current;

      if (vectorLayerRef.current) {
        const source = vectorLayerRef.current.getSource();
        if (source) {
          source.clear();
        }
        map.removeLayer(vectorLayerRef.current);
      }

      const features: Feature[] = [];

      if (isIndividualPoints && newPoints.length > 0) {
        newPoints.forEach((point: PointData) => {
          const feature = new Feature({
            geometry: new Point(fromLonLat([point.longitude, point.latitude])),
            pointData: point,
            isIndividualPoint: true,
          });
          features.push(feature);
        });
      } else if (!isIndividualPoints && newClusters.length > 0) {
        newClusters.forEach((cluster: ClusterData) => {
          const feature = new Feature({
            geometry: new Point(
              fromLonLat([cluster.cluster_lng, cluster.cluster_lat])
            ),
            clusterData: cluster,
            isIndividualPoint: false,
          });
          features.push(feature);
        });
      }

      if (features.length === 0) return;

      const vectorSource = new VectorSource({ features });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature: FeatureLike) => {
          const isIndividual = feature.get("isIndividualPoint") as boolean;

          if (isIndividual) {
            return new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: "rgba(220, 38, 38, 0.9)" }),
                stroke: new Stroke({
                  color: "rgba(255, 255, 255, 1)",
                  width: 2,
                }),
              }),
            });
          } else {
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
                stroke: new Stroke({
                  color: "rgba(255, 255, 255, 0.8)",
                  width: 2,
                }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({ color: "#fff" }),
                font: "bold 12px Arial",
              }),
            });
          }
        },
      });

      vectorLayerRef.current = vectorLayer;
      map.addLayer(vectorLayer);
    },
    []
  );

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
        center: fromLonLat(centreRef.current),
        zoom: initialZoomRef.current,
        constrainResolution: false,
        minZoom: 2,
        maxZoom: 20,
        enableRotation: false,
      }),
      controls: [],
    });

    mapInstanceRef.current = map;

    let zoomTimeout: NodeJS.Timeout;
    let moveTimeout: NodeJS.Timeout;

    const handleInteractionStart = () => {
      isUserInteractionRef.current = true;
    };

    const handleInteractionEnd = () => {
      setTimeout(() => {
        isUserInteractionRef.current = false;
      }, 100);
    };

    const handleViewChange = () => {
      clearTimeout(zoomTimeout);
      clearTimeout(moveTimeout);

      zoomTimeout = setTimeout(() => {
        const newZoom = Math.round(
          map.getView().getZoom() || initialZoomRef.current
        );
        updateZoom(newZoom);
        handleInteractionEnd();
      }, 500);

      moveTimeout = setTimeout(() => {
        updateBoundingBox();
      }, 1000);
    };

    const handleMapClick = (evt: { pixel: number[]; coordinate: number[] }) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );
      if (feature) {
        const isIndividual = feature.get("isIndividualPoint") as boolean;
        if (isIndividual) {
          const pointData = feature.get("pointData") as PointData;
          const coordinate = evt.coordinate as [number, number];
          openPopup(pointData, coordinate);
        } else {
          closePopup();
        }
      } else {
        closePopup();
      }
    };

    map.on("click", handleMapClick);
    map.on("pointerdrag", handleInteractionStart);
    map.getView().on("change:resolution", handleInteractionStart);
    map.getView().on("change:center", handleViewChange);
    map.getView().on("change:resolution", handleViewChange);

    map.on("pointermove", (evt) => {
      const pixel = map.getEventPixel(evt.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
      const target = map.getTarget() as HTMLElement;

      if (feature && feature.get("isIndividualPoint")) {
        target.style.cursor = "pointer";
      } else {
        target.style.cursor = "";
      }
    });

    updateBoundingBox();

    return () => {
      clearTimeout(zoomTimeout);
      clearTimeout(moveTimeout);
      closePopup();

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [updateZoom, updateBoundingBox, openPopup, closePopup]);

  useEffect(() => {
    updateMapWithData(clusters, points, useIndividualPoints);
  }, [clusters, points, useIndividualPoints, updateMapWithData]);

  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !popupData ||
      !popupCoordinate ||
      !popupContainerRef.current
    ) {
      return;
    }

    const map = mapInstanceRef.current;

    if (overlayRef.current) {
      try {
        map.removeOverlay(overlayRef.current);
      } catch (error) {
        console.warn("Error removing overlay:", error);
      }
      overlayRef.current = null;
    }

    const overlay = new Overlay({
      element: popupContainerRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -15],
    });

    try {
      overlay.setPosition(popupCoordinate);
      map.addOverlay(overlay);
      overlayRef.current = overlay;
    } catch (error) {
      console.warn("Error creating overlay:", error);
    }

    return () => {
      if (overlayRef.current) {
        try {
          map.removeOverlay(overlayRef.current);
        } catch (error) {
          console.warn("Error in overlay cleanup:", error);
        }
        overlayRef.current = null;
      }
    };
  }, [popupData, popupCoordinate]);

  const showLoading =
    isFetching && (!clusters || clusters.length === 0) && !isLoading;

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100vh" }}
      role="application"
      aria-label="Interactive police data map"
    >
      {error && (
        <div
          className={styles.overlayContainer}
          role="alert"
          aria-live="assertive"
        >
          <div className={styles.errorMessage}>
            <strong>Error loading map data:</strong> {error.message}
          </div>
        </div>
      )}
      {showLoading && (
        <div
          className={styles.overlayContainer}
          role="status"
          aria-live="polite"
          aria-label="Loading map data"
        >
          <div>Loading map data...</div>
        </div>
      )}
      <div ref={mapRef} className={styles.mapContainer} />

      {popupData &&
        popupContainerRef.current &&
        createPortal(
          <StopSearchPopup data={popupData} onClose={closePopup} />,
          popupContainerRef.current
        )}

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
