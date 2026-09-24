import type { Config } from "tailwindcss";

// Tokens pulled directly from the Stitch "Academic Kinetic" design system
// (academic_kinetic/DESIGN.md) so every page we build matches the approved
// screens exactly. Don't hand-pick new colors elsewhere in the app —
// extend this file instead so the whole site stays consistent.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#ccdbf3",
          bright: "#f8f9ff",
          lowest: "#ffffff",
          low: "#eff4ff",
          container: "#e6eeff",
          high: "#dce9ff",
          highest: "#d5e3fc",
        },
        onSurface: {
          DEFAULT: "#0d1c2e",
          variant: "#44474c",
        },
        inverse: {
          surface: "#233144",
          onSurface: "#eaf1ff",
        },
        outline: {
          DEFAULT: "#74777d",
          variant: "#c4c6cc",
        },
        primary: {
          DEFAULT: "#000000",
          on: "#ffffff",
          container: "#0f1c2c",
          onContainer: "#778598",
        },
        secondary: {
          DEFAULT: "#006c4a",
          on: "#ffffff",
          container: "#82f5c1",
          onContainer: "#00714e",
        },
        tertiary: {
          DEFAULT: "#000000",
          on: "#ffffff",
          container: "#002113",
          onContainer: "#009668",
        },
        error: {
          DEFAULT: "#ba1a1a",
          on: "#ffffff",
          container: "#ffdad6",
          onContainer: "#93000a",
        },
        background: "#f8f9ff",
        onBackground: "#0d1c2e",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["44px", { lineHeight: "52px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-hero-mobile": ["32px", { lineHeight: "38px", letterSpacing: "-0.025em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["26px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(13, 28, 46, 0.06)",
        floating: "0 8px 24px rgba(13, 28, 46, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
