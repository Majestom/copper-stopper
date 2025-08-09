import { style } from "@vanilla-extract/css";

export const exampleButton = style({
  padding: "12px 24px",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "500",
  transition: "background-color 0.2s ease",

  ":hover": {
    backgroundColor: "#0051cc",
  },

  ":active": {
    transform: "translateY(1px)",
  },
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "2rem",
});
