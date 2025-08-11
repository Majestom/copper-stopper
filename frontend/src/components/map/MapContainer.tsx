import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import { useBasicPoliceData } from "@/hooks/useBasicPoliceData";
import { StopSearchRecord } from "@/schemas/dbSchemas";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {
  MapContainerProps,
  MapContainerPropsSchema,
} from "../../schemas/mapSchemas";
import * as styles from "./MapContainer.css";

export default function MapContainer(props: MapContainerProps) {
  const { width, height, centre, zoom } = MapContainerPropsSchema.parse(props);

  const { data: policeData, isLoading, error } = useBasicPoliceData();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);

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
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [centre, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || !policeData?.data) return;

    const map = mapInstanceRef.current;
    if (vectorLayerRef.current) {
      map.removeLayer(vectorLayerRef.current);
    }

    if (isLoading || error || !policeData.data) return;

    const features = policeData.data
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
            },
          });

          feature.setStyle(
            new Style({
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
            })
          );

          return feature;
        }
      });

    const vectorSource = new VectorSource({
      features: features.filter(
        (f: Feature | undefined) => f !== undefined
      ) as Feature[],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    vectorLayerRef.current = vectorLayer;
    map.addLayer(vectorLayer);
  }, [policeData, error, isLoading]);

  return <div ref={mapRef} className={styles.mapContainer} />;
}
