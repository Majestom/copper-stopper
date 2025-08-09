import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  minHeight: "100vh",
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
