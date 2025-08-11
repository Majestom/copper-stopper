import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  minHeight: "100vh",
  position: "relative",
});

export const content = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

export const main = style({
  flex: 1,
  overflow: "auto",
});

export const mobileMenuToggle = style({
  display: "none",
});

export const mobileMenuLabel = style({
  display: "none",
  position: "fixed",
  top: "1rem",
  right: "1rem",
  zIndex: 1001,
  padding: "0.75rem",
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "#f9fafb",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  ":active": {
    transform: "scale(0.95)",
  },
  "@media": {
    "(max-width: 768px)": {
      display: "block",
    },
  },
});

export const sidebarWrapper = style({
  transition: "transform 0.3s ease",
  "@media": {
    "(max-width: 768px)": {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      zIndex: 1000,
      transform: "translateX(-100%)",
    },
  },
  selectors: {
    [`${mobileMenuToggle}:checked ~ * &`]: {
      "@media": {
        "(max-width: 768px)": {
          transform: "translateX(0)",
        },
      },
    },
  },
});

export const overlay = style({
  display: "none",
  "@media": {
    "(max-width: 768px)": {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
      opacity: 0,
      pointerEvents: "none",
      transition: "opacity 0.3s ease",
      display: "block",
    },
  },
  selectors: {
    [`${mobileMenuToggle}:checked ~ * &`]: {
      "@media": {
        "(max-width: 768px)": {
          opacity: 1,
          pointerEvents: "auto",
        },
      },
    },
  },
});

export const hamburgerIcon = style({
  width: "24px",
  height: "24px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
});

export const hamburgerLine = style({
  width: "100%",
  height: "2px",
  backgroundColor: "#374151",
  transition: "all 0.3s ease",
  transformOrigin: "center",
});

export const hamburgerLineTop = style([
  hamburgerLine,
  {
    selectors: {
      [`${mobileMenuToggle}:checked ~ ${mobileMenuLabel} & `]: {
        transform: "rotate(45deg)",
        position: "absolute",
        top: "50%",
        left: 0,
      },
    },
  },
]);

export const hamburgerLineMiddle = style([
  hamburgerLine,
  {
    selectors: {
      [`${mobileMenuToggle}:checked ~ ${mobileMenuLabel} &`]: {
        opacity: 0,
      },
    },
  },
]);

export const hamburgerLineBottom = style([
  hamburgerLine,
  {
    selectors: {
      [`${mobileMenuToggle}:checked ~ ${mobileMenuLabel} &`]: {
        transform: "rotate(-45deg)",
        position: "absolute",
        top: "50%",
        left: 0,
      },
    },
  },
]);
