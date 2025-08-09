import { z } from "zod";

export const MapContainerPropsSchema = z.object({
  width: z.string().optional().default("100%"),
  height: z.string().optional().default("500px"),
  centre: z
    .tuple([z.number(), z.number()])
    .optional()
    .default([-0.1278, 51.5074]),
  zoom: z.number().min(1).max(20).optional().default(10),
});

export type MapContainerProps = z.infer<typeof MapContainerPropsSchema>;
