import { z } from "zod";

const sqliteBooleanSchema = z.union([
  z.boolean(),
  z.number().transform((val) => Boolean(val)),
  z.null(),
]);

export const StopSearchRecordSchema = z.object({
  id: z.number(),
  datetime: z.string(),
  type: z.string().nullable(),
  age_range: z.string().nullable(),
  gender: z.string().nullable(),
  self_defined_ethnicity: z.string().nullable(),
  officer_defined_ethnicity: z.string().nullable(),
  legislation: z.string().nullable(),
  object_of_search: z.string().nullable(),
  outcome: z.string().nullable(),
  outcome_linked_to_object_of_search: sqliteBooleanSchema,
  removal_of_more_than_outer_clothing: sqliteBooleanSchema,
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  street_id: z.number().nullable(),
  street_name: z.string().nullable(),
  involved_person: sqliteBooleanSchema,
  operation: sqliteBooleanSchema,
  operation_name: z.string().nullable(),
  force: z.string(),
  source_date: z.string(),
  created_at: z.string(),
});

export const QueryFiltersSchema = z.object({
  limit: z.number().min(1).max(10000).default(100),
  offset: z.number().min(0).default(0),
  hasLocation: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  outcome: z.array(z.string()).optional(),
  ageRange: z.array(z.string()).optional(),
  gender: z.array(z.string()).optional(),
  searchType: z.array(z.string()).optional(),
});

export type StopSearchRecord = z.infer<typeof StopSearchRecordSchema>;
export type QueryFilters = z.infer<typeof QueryFiltersSchema>;
