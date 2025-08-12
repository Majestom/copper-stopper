import { style } from "@vanilla-extract/css";

export const mapContainer = style({
  width: "100%",
  height: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
});

export const overlayContainer = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  zIndex: 1000,
  borderRadius: "4px",
});

export const loadingMessage = style({
  padding: "16px 24px",
  backgroundColor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#666",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

export const errorMessage = style({
  padding: "16px 24px",
  backgroundColor: "#f8d7da",
  border: "1px solid #f5c6cb",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#721c24",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});
