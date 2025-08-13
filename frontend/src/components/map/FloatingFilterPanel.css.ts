import { style, keyframes } from "@vanilla-extract/css";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const panel = style({
  position: "absolute",
  top: "16px",
  left: "16px",
  zIndex: 10,
  backgroundColor: "white",
  color: "#1f2937",
  borderRadius: "8px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: "1px solid #e5e7eb",
  width: "340px",
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100vh - 32px)",
  "@media": {
    "screen and (max-width: 768px)": {
      top: "80px", // Push down on mobile to avoid hamburger menu
    },
  },
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px",
  backgroundColor: "#f9fafb",
  borderBottom: "1px solid #e5e7eb",
  cursor: "pointer",
  borderRadius: "8px 8px 0 0",
  flexShrink: 0,
  ":hover": {
    backgroundColor: "#f3f4f6",
  },
  border: "none",
});

export const headerLeft = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const headerRight = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const title = style({
  fontWeight: 500,
  color: "#1f2937",
});

export const badge = style({
  backgroundColor: "#3b82f6",
  color: "white",
  fontSize: "12px",
  borderRadius: "9999px",
  paddingLeft: "8px",
  paddingRight: "8px",
  paddingTop: "2px",
  paddingBottom: "2px",
});

export const spinner = style({
  animation: `${spin} 1s linear infinite`,
  borderRadius: "50%",
  height: "16px",
  width: "16px",
  border: "2px solid #3b82f6",
  borderTopColor: "transparent",
});

export const expandIcon = style({
  color: "#6b7280",
  fontSize: "18px",
  lineHeight: 1,
});

export const content = style({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const scrollableContent = style({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  overflowY: "auto",
  flex: 1,
  minHeight: 0,
});

export const fieldGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  border: "none",
  padding: 0,
  margin: 0,
  minWidth: 0,
});

export const label = style({
  fontSize: "14px",
  fontWeight: 500,
  color: "#374151",
});

export const legend = style({
  fontSize: "14px",
  fontWeight: 500,
  color: "#374151",
  padding: 0,
  margin: 0,
  marginBottom: "8px",
  display: "block",
  width: "100%",
});

export const dateGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
});

export const input = style({
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#374151",
  ":focus": {
    outline: "none",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
  },
});

export const select = style({
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#374151",
  ":focus": {
    outline: "none",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
  },
});

export const clearButton = style({
  width: "100%",
  padding: "8px 12px",
  fontSize: "14px",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#e5e7eb",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const activeFilters = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
});

export const activeFilterTag = style({
  backgroundColor: "#dbeafe",
  color: "#1e40af",
  fontSize: "12px",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "1px solid #bfdbfe",
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

export const removeFilterButton = style({
  backgroundColor: "transparent",
  border: "none",
  color: "#1e40af",
  cursor: "pointer",
  padding: "0",
  fontSize: "14px",
  lineHeight: 1,
  ":hover": {
    color: "#1d4ed8",
  },
});

export const checkboxGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const checkboxItem = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const checkbox = style({
  width: "16px",
  height: "16px",
  accentColor: "#3b82f6",
  cursor: "pointer",
  backgroundColor: "white",
  border: "1px solid #d1d5db",
  borderRadius: "2px",
});

export const checkboxLabel = style({
  fontSize: "14px",
  color: "#374151",
  cursor: "pointer",
});

export const totalCount = style({
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: 500,
  textAlign: "center",
  padding: "12px 16px",
  borderTop: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  borderRadius: "0 0 8px 8px",
  flexShrink: 0, // Prevent this from shrinking
});
