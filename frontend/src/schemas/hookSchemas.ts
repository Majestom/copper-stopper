import { z } from "zod";

export const MapFiltersSchema = z.object({
  bbox: z.string().optional(),
  type: z.string().optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  selfDefinedEthnicity: z.string().optional(),
  officerDefinedEthnicity: z.string().optional(),
  legislation: z.string().optional(),
  objectOfSearch: z.string().optional(),
  outcome: z.string().optional(),
  outcomeLinkedToObjectOfSearch: z.string().optional(),
  removalOfMoreThanOuterClothing: z.string().optional(),
  streetName: z.string().optional(),
  involvedPerson: z.string().optional(),
  operation: z.string().optional(),
  operationName: z.string().optional(),
  force: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type MapFilters = z.infer<typeof MapFiltersSchema>;

export type FetchMapDataParams = {
  filters: MapFilters;
  limit?: number;
};

export type ClusterData = {
  cluster_lat: number;
  cluster_lng: number;
  point_count: number;
  bounds_min_lat: number;
  bounds_max_lat: number;
  bounds_min_lng: number;
  bounds_max_lng: number;
};

export type PointData = {
  id: number;
  datetime: string;
  type: string;
  age_range: string | null;
  gender: string | null;
  self_defined_ethnicity: string | null;
  officer_defined_ethnicity: string | null;
  legislation: string | null;
  object_of_search: string | null;
  outcome: string | null;
  outcome_linked_to_object_of_search: boolean | null;
  removal_of_more_than_outer_clothing: boolean | null;
  latitude: number;
  longitude: number;
  street_name: string | null;
  involved_person: boolean | null;
  operation: boolean | null;
  operation_name: string | null;
  force: string;
};

export type ClusterResponse = {
  clusters: ClusterData[];
  meta: {
    zoom: number;
    precision: number;
    clusterCount: number;
    pointsRepresented: number;
    totalPoints: number;
    bbox?: string;
    queryType: string;
  };
  filters: MapFilters;
};

export type PointResponse = {
  data: PointData[];
  meta: {
    returned: number;
    limit: number;
    hasMore: boolean;
    bbox?: string;
    queryType: string;
  };
  filters: MapFilters;
};

export type MapDataResponse = ClusterResponse | PointResponse;

export type FetchDataParams = {
  filters: MapFilters;
  zoom: number;
  bbox?: string;
  useIndividualPoints?: boolean;
};
