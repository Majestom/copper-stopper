import { style } from "@vanilla-extract/css";

export const analyticsContainer = style({
  padding: "24px",
  maxWidth: "1200px",
  margin: "0 auto",
});

export const header = style({
  marginBottom: "32px",
});

export const title = style({
  fontSize: "28px",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "8px",
});

export const subtitle = style({
  fontSize: "16px",
  color: "#6b7280",
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "24px",
  marginBottom: "32px",
});

export const statCard = style({
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
});

export const statValue = style({
  fontSize: "32px",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "8px",
});

export const statLabel = style({
  fontSize: "14px",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const chartContainer = style({
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
});

export const chartTitle = style({
  fontSize: "20px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "16px",
});

export const chartWrapper = style({
  position: "relative",
  height: "400px",
  width: "100%",
});

export const loadingContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "400px",
  fontSize: "18px",
  color: "#6b7280",
});

export const errorContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "400px",
  fontSize: "18px",
  color: "#dc2626",
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  padding: "24px",
});
