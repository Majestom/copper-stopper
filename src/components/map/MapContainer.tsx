import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import { z } from "zod";

const MapContainerPropsSchema = z.object({
  width: z.string().optional().default("100%"),
  height: z.string().optional().default("500px"),
  centre: z
    .tuple([z.number(), z.number()])
    .optional()
    .default([-0.1278, 51.5074]),
  zoom: z.number().min(1).max(20).optional().default(10),
});

type MapContainerProps = z.infer<typeof MapContainerPropsSchema>;

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

  return (
    <div
      ref={mapRef}
      style={{
        width,
        height,
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
}
