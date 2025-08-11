import { style } from "@vanilla-extract/css";
import { createVar } from "@vanilla-extract/css";

const primaryColor = createVar();
const successColor = createVar();
const errorColor = createVar();
const textSecondary = createVar();
const borderRadius = createVar();
const shadowSm = createVar();
const shadowMd = createVar();

export const pageContainer = style({
  vars: {
    [primaryColor]: "#3b82f6",
    [successColor]: "#10b981",
    [errorColor]: "#ef4444",
    [textSecondary]: "#6b7280",
    [borderRadius]: "8px",
    [shadowSm]: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    [shadowMd]:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "2rem",
  backgroundColor: "#ffffff",
  color: "#1f2937",
  minHeight: "100vh",
  "@media": {
    "(max-width: 768px)": {
      padding: "1rem",
    },
    "(prefers-color-scheme: dark)": {
      backgroundColor: "#ffffff",
      color: "#1f2937",
    },
  },
});

export const header = style({
  marginBottom: "1.5rem",
  "@media": {
    "(max-width: 768px)": {
      marginBottom: "1rem",
      textAlign: "center",
    },
  },
});

export const title = style({
  fontSize: "1.875rem",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "0.5rem",
  lineHeight: "1.3",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
});

export const alertBase = style({
  padding: "1rem",
  borderRadius: borderRadius,
  fontSize: "0.875rem",
  fontWeight: "400",
  marginBottom: "1.5rem",
  boxShadow: shadowSm,
  border: "1px solid",
  position: "relative",
  overflow: "hidden",
  lineHeight: "1.5",
  "::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
  },
  "@media": {
    "(max-width: 640px)": {
      padding: "0.875rem",
      fontSize: "0.8rem",
    },
  },
});

export const errorAlert = style([
  alertBase,
  {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    color: "#991b1b",
    "::before": {
      backgroundColor: errorColor,
    },
  },
]);

export const successAlert = style([
  alertBase,
  {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    color: "#166534",
    "::before": {
      backgroundColor: successColor,
    },
  },
]);

export const statsCard = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1.5rem",
  padding: "1.25rem",
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: borderRadius,
  boxShadow: shadowMd,
  transition: "all 0.2s ease-in-out",
  ":hover": {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transform: "translateY(-1px)",
  },
  "@media": {
    "(max-width: 640px)": {
      flexDirection: "column",
      textAlign: "center",
      gap: "0.75rem",
      padding: "1rem",
    },
  },
});

export const statsIcon = style({
  fontSize: "1.5rem",
  padding: "0.75rem",
  borderRadius: "50%",
  backgroundColor: "#dbeafe",
  color: primaryColor,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "3rem",
  height: "3rem",
});

export const statsContent = style({
  flex: 1,
});

export const statsTitle = style({
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "0.25rem",
  textTransform: "uppercase",
  letterSpacing: "0.025em",
});

export const statsValue = style({
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1f2937",
  lineHeight: "1",
});

export const statsSubtext = style({
  fontSize: "0.875rem",
  color: textSecondary,
  marginTop: "0.25rem",
});

export const tableSection = style({
  backgroundColor: "white",
  borderRadius: borderRadius,
  boxShadow: shadowMd,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
});

export const tableHeader = style({
  padding: "1.25rem 1.5rem 1rem",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f8fafc",
  "@media": {
    "(max-width: 768px)": {
      padding: "1rem",
    },
  },
});

export const tableSectionTitle = style({
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "0.5rem",
});

export const tableSectionSubtitle = style({
  fontSize: "0.875rem",
  color: textSecondary,
});

export const tableContent = style({
  padding: "1.5rem",
  "@media": {
    "(max-width: 768px)": {
      padding: "1rem",
    },
    "(max-width: 640px)": {
      padding: "0.75rem",
    },
  },
});

// Force light mode wrapper
export const lightModeWrapper = style({
  backgroundColor: "#ffffff",
  color: "#1f2937",
  minHeight: "100vh",
  "@media": {
    "(prefers-color-scheme: dark)": {
      backgroundColor: "#ffffff !important",
      color: "#1f2937 !important",
    },
  },
});
