// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        primary: "#f59e0b",
        secondary: "#6366f1",
        success: "#10b981",
        danger: "#ef4444",
        card: "#12121a",
        border: "#1e1e2e",
      },
    },
  },
  plugins: [],
};
export default config;
