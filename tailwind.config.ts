import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        "background-subtle": "#F7F7F5",
        surface: "#FFFFFF",
        border: "#E9E7E1",
        "text-primary": "#191917",
        "text-secondary": "#5F5B53",
        "text-muted": "#8A867D",
        primary: {
          DEFAULT: "#191917",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1EFE8",
          foreground: "#191917",
        },
        success: "#2F7D4A",
        warning: "#B7791F",
        danger: "#C94C4C",
        info: "#6B7280",
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "6px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        display: ["2.75rem", { lineHeight: "1.15", fontWeight: "600" }],
        h1: ["2.75rem", { lineHeight: "1.15" }],
        h2: ["1.875rem", { lineHeight: "1.2" }],
        h3: ["1.375rem", { lineHeight: "1.25" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        body: ["1rem", { lineHeight: "1.65" }],
        caption: ["0.875rem", { lineHeight: "1.5" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06)",
        modal: "0 4px 16px 0 rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
