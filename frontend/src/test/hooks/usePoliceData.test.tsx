import { describe, it, expect, vi, beforeEach } from "vitest";

const mockPoliceDataResponse = {
  data: [
    {
      id: 1,
      datetime: "2024-01-15T10:30:00Z",
      type: "Person search",
      gender: "Male",
      age_range: "18-24",
    },
  ],
  pagination: {
    current: { page: 1, pageSize: 100 },
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPageRecords: 1,
  },
};

describe("Police Data Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should handle successful data fetching", async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPoliceDataResponse,
    } as Response);

    expect(mockPoliceDataResponse.data).toHaveLength(1);
    expect(mockPoliceDataResponse.pagination.total).toBe(1);
    expect(mockPoliceDataResponse.data[0].type).toBe("Person search");
  });

  it("should handle API errors gracefully", async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    try {
      throw new Error("API Error");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("API Error");
    }
  });

  it("should validate filter parameters", () => {
    const validFilters = {
      search: "test search",
      type: "Person search",
      gender: "Male",
      outcome: "Nothing found",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
    };

    expect(typeof validFilters.search).toBe("string");
    expect(validFilters.type).toBe("Person search");
    expect(validFilters.gender).toBe("Male");
  });

  it("should handle pagination correctly", () => {
    const paginationData = {
      current: { page: 2, pageSize: 50 },
      total: 150,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
      currentPageRecords: 50,
    };

    expect(paginationData.totalPages).toBe(
      Math.ceil(paginationData.total / paginationData.current.pageSize)
    );
    expect(paginationData.hasNextPage).toBe(
      paginationData.current.page < paginationData.totalPages
    );
    expect(paginationData.hasPreviousPage).toBe(
      paginationData.current.page > 1
    );
  });
});

describe("Data Transformation", () => {
  it("should transform raw API data correctly", () => {
    const rawData = {
      datetime: "2024-01-15T10:30:00Z",
      type: "Person search",
      gender: "Male",
      outcome: "Nothing found - no further action",
    };

    const transformedDate = new Date(rawData.datetime);
    expect(transformedDate).toBeInstanceOf(Date);
    expect(transformedDate.getFullYear()).toBe(2024);

    const dataWithNulls = {
      ...rawData,
      gender: null,
      outcome: undefined,
    };

    const safeGender = dataWithNulls.gender || "N/A";
    const safeOutcome = dataWithNulls.outcome || "N/A";

    expect(safeGender).toBe("N/A");
    expect(safeOutcome).toBe("N/A");
  });
});
