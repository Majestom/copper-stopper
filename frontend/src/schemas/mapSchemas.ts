import { MapFilters } from "@/hooks/usePoliceDataForMap";
import { z } from "zod";
import { PointData } from "./hookSchemas";

export const MapContainerPropsSchema = z.object({
  width: z.string().default("100%"),
  height: z.string().default("500px"),
  centre: z.tuple([z.number(), z.number()]).default([-0.1278, 51.5074]),
  zoom: z.number().min(1).max(20).default(10),
  className: z.string().optional(),
});

export type MapContainerProps = z.infer<typeof MapContainerPropsSchema>;

export type FloatingFilterPanelProps = {
  filters: MapFilters;
  onFiltersChange: (filters: Partial<MapFilters>) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  totalCount?: number;
};

export type StopSearchPopupProps = {
  data: PointData;
  onClose: () => void;
};
