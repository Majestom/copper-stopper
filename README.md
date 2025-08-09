# Copper Stopper

A Next.js application built with the Pages Router and Vanilla Extract for type-safe CSS-in-TypeScript styling.

## Features

- **Next.js 15+** with Pages Router (not App Router)
- **TypeScript** for type safety
- **Vanilla Extract** for CSS-in-TypeScript styling
- **ESLint** for code quality
- No Tailwind CSS - using Vanilla Extract for styling
- No Turbopack - using standard Next.js build

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `src/pages/api/hello.ts`.

## Styling with Vanilla Extract

This project uses [Vanilla Extract](https://vanilla-extract.style/) for styling. Create `.css.ts` files in the `src/styles/` directory and import them as named exports:

```typescript
// src/styles/button.css.ts
import { style } from "@vanilla-extract/css";

export const button = style({
  padding: "12px 24px",
  backgroundColor: "#0070f3",
  color: "white",
  borderRadius: "6px",
});
```

```tsx
// In your component
import { button } from "@/styles/button.css";

export default function MyComponent() {
  return <button className={button}>Click me</button>;
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
