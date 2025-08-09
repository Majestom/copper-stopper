import { z } from "zod";

export const MapContainerPropsSchema = z.object({
  width: z.string().default("100%"),
  height: z.string().default("500px"),
  centre: z.tuple([z.number(), z.number()]).default([-0.1278, 51.5074]),
  zoom: z.number().min(1).max(20).default(10),
  className: z.string().optional(),
});

export type MapContainerProps = z.infer<typeof MapContainerPropsSchema>;
