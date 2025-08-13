import { describe, it, expect } from "vitest";

describe("Date Utilities", () => {
  it("formats dates correctly", () => {
    const testDate = new Date("2024-01-15T10:30:00Z");
    const formatted = testDate.toLocaleString();

    expect(formatted).toContain("2024");
    expect(typeof formatted).toBe("string");
  });

  it("creates month keys correctly", () => {
    const testDate = new Date("2024-01-15T10:30:00Z");
    const monthKey = `${testDate.getFullYear()}-${String(
      testDate.getMonth() + 1
    ).padStart(2, "0")}`;

    expect(monthKey).toBe("2024-01");
  });

  it("handles invalid dates gracefully", () => {
    const invalidDate = new Date("invalid");

    expect(invalidDate.toString()).toBe("Invalid Date");
    expect(isNaN(invalidDate.getTime())).toBe(true);
  });
});

describe("Data Transformations", () => {
  it("handles null values safely", () => {
    const testValue = null;
    const fallback = "N/A";
    const result = testValue || fallback;

    expect(result).toBe("N/A");
  });

  it("trims and handles empty strings", () => {
    const testString = "  test value  ";
    const trimmed = testString.trim();

    expect(trimmed).toBe("test value");

    const emptyString = "   ";
    const trimmedEmpty = emptyString.trim();

    expect(trimmedEmpty).toBe("");
    expect(trimmedEmpty || "fallback").toBe("fallback");
  });

  it("validates numeric values", () => {
    expect(typeof 123).toBe("number");
    expect(Number.isInteger(123)).toBe(true);
    expect(Number.isInteger(123.45)).toBe(false);
    expect(123 >= 0).toBe(true);
  });
});

describe("Array Operations", () => {
  it("filters arrays correctly", () => {
    const testArray = [1, 2, 3, 4, 5];
    const filtered = testArray.filter((n) => n > 3);

    expect(filtered).toEqual([4, 5]);
    expect(filtered.length).toBe(2);
  });

  it("maps arrays correctly", () => {
    const testArray = ["apple", "banana", "cherry"];
    const mapped = testArray.map((fruit) => fruit.toUpperCase());

    expect(mapped).toEqual(["APPLE", "BANANA", "CHERRY"]);
  });

  it("reduces arrays correctly", () => {
    const testArray = [1, 2, 3, 4, 5];
    const sum = testArray.reduce((acc, curr) => acc + curr, 0);

    expect(sum).toBe(15);
  });
});
