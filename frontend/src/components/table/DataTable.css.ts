import { style, createVar } from "@vanilla-extract/css";

const borderColor = createVar();
const hoverBackgroundColor = createVar();
const headerBackgroundColor = createVar();
const sortedHeaderBackgroundColor = createVar();

export const container = style({
  width: "100%",
  vars: {
    [borderColor]: "#e9ecef",
    [hoverBackgroundColor]: "#f8f9fa",
    [headerBackgroundColor]: "#f8f9fa",
    [sortedHeaderBackgroundColor]: "#e9ecef",
  },
});

export const loadingContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
});

export const searchContainer = style({
  marginBottom: "16px",
});

export const searchInput = style({
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  width: "100%",
  maxWidth: "400px",
  fontSize: "14px",
  backgroundColor: "white",
  transition: "all 0.15s ease",
  ":focus": {
    outline: "none",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },
});

export const tableWrapper = style({
  border: `1px solid #d1d5db`,
  borderRadius: "6px",
  overflow: "auto",
  backgroundColor: "white",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "700px",
});

export const tableHead = style({
  backgroundColor: "#f3f4f6",
  borderBottom: "2px solid #e5e7eb",
});

export const headerCell = style({
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: "600",
  borderBottom: "2px solid #e5e7eb",
  userSelect: "none",
  backgroundColor: "transparent",
  color: "#374151",
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.025em",
  whiteSpace: "nowrap",
});

export const sortableHeader = style([
  headerCell,
  {
    cursor: "pointer",
    transition: "all 0.15s ease",
    ":hover": {
      backgroundColor: "#e5e7eb",
      color: "#1f2937",
    },
  },
]);

export const sortedHeader = style([
  sortableHeader,
  {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
]);

export const tableRow = style({
  borderBottom: "1px solid #e5e7eb",
  transition: "background-color 0.15s ease",
  selectors: {
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
    "&:nth-child(even)": {
      backgroundColor: "#fafafa",
    },
    "&:nth-child(even):hover": {
      backgroundColor: "#f3f4f6",
    },
  },
});

export const tableCell = style({
  padding: "12px 16px",
  fontSize: "14px",
  maxWidth: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#374151",
  borderRight: "1px solid #f3f4f6",
  ":last-child": {
    borderRight: "none",
  },
});

export const paginationContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  fontSize: "14px",
  color: "#666",
  flexWrap: "wrap",
  gap: "1rem",
});

export const paginationInfo = style({
  margin: 0,
});

export const paginationControls = style({
  display: "flex",
  gap: "8px",
  alignItems: "center",
  justifyContent: "center",
});

export const paginationButton = style({
  padding: "6px 12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "white",
  cursor: "pointer",
  transition: "all 0.15s ease",
  fontSize: "0.875rem",
  minWidth: "40px",
  ":hover": {
    backgroundColor: "#f8f9fa",
    borderColor: "#007bff",
  },
  ":active": {
    backgroundColor: "#e9ecef",
  },
});

export const paginationButtonDisabled = style([
  paginationButton,
  {
    backgroundColor: "#f5f5f5",
    cursor: "not-allowed",
    color: "#999",
    ":hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "#ccc",
    },
  },
]);

export const pageInfo = style({
  margin: "0 8px",
  fontWeight: "normal",
  whiteSpace: "nowrap",
});

export const pageInfoStrong = style({
  fontWeight: "600",
});
