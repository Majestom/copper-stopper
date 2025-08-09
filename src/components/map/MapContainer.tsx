import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import {
  MapContainerProps,
  MapContainerPropsSchema,
} from "../../schemas/mapSchemas";
import * as styles from "./MapContainer.css";

export default function MapContainer(props: MapContainerProps) {
  const { width, height, centre, zoom } = MapContainerPropsSchema.parse(props);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

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

  return <div ref={mapRef} className={styles.mapContainer} />;
}
