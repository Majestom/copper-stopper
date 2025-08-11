import { useQuery } from "@tanstack/react-query";

async function fetchBasicPoliceData() {
  const response = await fetch("/api/police-data?limit=10");

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

export function useBasicPoliceData() {
  return useQuery({
    queryKey: ["basicPoliceData"],
    queryFn: fetchBasicPoliceData,
  });
}
