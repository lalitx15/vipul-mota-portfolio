import type { Config } from "tailwindcss";

function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: withOpacity("--bg-ink"),
          soft: withOpacity("--bg-canvas"),
        },
        charcoal: {
          DEFAULT: withOpacity("--surface-charcoal"),
          light: withOpacity("--surface-elevated"),
          border: withOpacity("--border-line"),
        },
        ivory: {
          DEFAULT: withOpacity("--text-ivory"),
          muted: withOpacity("--text-stone"),
          dark: withOpacity("--text-stone"),
        },
        stone: {
          DEFAULT: withOpacity("--text-stone"),
          light: withOpacity("--text-stone"),
          dark: withOpacity("--text-stone"),
        },
        gold: {
          DEFAULT: withOpacity("--accent-gold"),
          light: withOpacity("--accent-gold"),
          dark: withOpacity("--accent-gold"),
          hover: withOpacity("--accent-gold"),
        },
        navy: {
          DEFAULT: "#0B132B",
          deep: "#070D1F",
          surface: "#101B3B",
          light: "#1C2951",
          border: "rgba(255, 255, 255, 0.12)",
        },
        line: "rgba(var(--border-line), var(--border-line-opacity, 0.08))",
        "line-strong": "rgba(var(--border-line), 0.18)",
        status: {
          error: "#C0392B",
          success: "#3C8D5A",
        },
      } as any,
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "var(--font-inter)",
          "var(--font-manrope)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "var(--font-inter)",
          "var(--font-cormorant)",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        widest: "0.18em",
        label: "0.14em",
        tight: "-0.025em",
        tighter: "-0.04em",
      },
      lineHeight: {
        tightest: "1.05",
        display: "1.12",
        relaxed: "1.65",
      },
      maxWidth: {
        site: "1440px",
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
