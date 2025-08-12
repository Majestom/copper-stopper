import { style } from "@vanilla-extract/css";

export const popup = style({
  position: "absolute",
  backgroundColor: "white",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
  minWidth: "250px",
  maxWidth: "350px",
  zIndex: 1000,
  transform: "translate(-50%, -100%)",
  marginTop: "-8px",
});

export const popupHeader = style({
  fontWeight: 600,
  fontSize: "16px",
  marginBottom: "8px",
  color: "#1f2937",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "6px",
});

export const popupContent = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const popupRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
});

export const popupLabel = style({
  fontWeight: 500,
  color: "#6b7280",
  minWidth: "80px",
  flexShrink: 0,
});

export const popupValue = style({
  color: "#1f2937",
  flex: 1,
  textAlign: "right",
  wordBreak: "break-word",
});

export const popupCloseButton = style({
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280",
  padding: "2px",
  lineHeight: 1,
  ":hover": {
    color: "#374151",
  },
});

export const outcomeStyle = style({
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 500,
  backgroundColor: "#f3f4f6",
  color: "#374151",
});

export const outcomeBadge = {
  arrest: style({
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  }),
  caution: style({
    backgroundColor: "#fffbeb",
    color: "#d97706",
  }),
  warning: style({
    backgroundColor: "#fef3c7",
    color: "#92400e",
  }),
  nothing: style({
    backgroundColor: "#f0f9ff",
    color: "#0284c7",
  }),
};
