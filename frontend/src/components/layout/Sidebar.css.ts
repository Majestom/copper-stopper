import { style } from "@vanilla-extract/css";

export const sidebar = style({
  minWidth: "180px",
  width: "max-content",
  maxWidth: "220px",
  height: "100%",
  backgroundColor: "#f8f9fa",
  borderRight: "1px solid #e9ecef",
  display: "flex",
  flexDirection: "column",
  padding: "20px 0",
});

export const nav = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "0 16px",
});

export const navButton = style({
  display: "flex",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "500",
  color: "#495057",
  textDecoration: "none",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",

  ":hover": {
    backgroundColor: "#e9ecef",
    color: "#212529",
  },
});

export const navButtonActive = style({
  backgroundColor: "#007bff",
  color: "white",

  ":hover": {
    backgroundColor: "#0056b3",
    color: "white",
  },
});

export const navIcon = style({
  marginRight: "12px",
  width: "20px",
  height: "20px",
});
