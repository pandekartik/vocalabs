import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colors ────────────────────────────────────────
      colors: {
        // VocaLabs brand tokens
        brand: {
          DEFAULT: "var(--vl-brand)",
          hover: "var(--vl-brand-hover)",
          dim: "var(--vl-brand-dim)",
        },
        navy: "var(--vl-navy)",
        ink: "var(--vl-ink)",
        "vl-gray-1": "var(--vl-gray-1)",
        "vl-gray-2": "var(--vl-gray-2)",
        "vl-gray-3": "var(--vl-gray-3)",
        "vl-gray-4": "var(--vl-gray-4)",
        live: "var(--vl-green)",
        danger: "var(--vl-red)",
        oncall: "var(--vl-orange)",
        info: "var(--vl-blue)",
        warning: "var(--vl-amber)",

        // Shadcn / legacy tokens (preserved for ui/ components)
        background: "var(--background)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // ── Font Family ───────────────────────────────────
      fontFamily: {
        // IBM Plex Sans is loaded via next/font and applied via --font-ibm-plex-sans
        sans: ["var(--font-ibm-plex-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      // ── Font Sizes ────────────────────────────────────
      fontSize: {
        "vl-caps": ["var(--vl-font-caps)", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        "vl-xs": ["var(--vl-font-xs)", { lineHeight: "1.5" }],
        "vl-sm": ["var(--vl-font-sm)", { lineHeight: "1.5" }],
        "vl-base": ["var(--vl-font-base)", { lineHeight: "1.5" }],
        "vl-md": ["var(--vl-font-md)", { lineHeight: "1.4" }],
        "vl-lg": ["var(--vl-font-lg)", { lineHeight: "1.3" }],
        "vl-xl": ["var(--vl-font-xl)", { lineHeight: "1.2" }],
        "vl-2xl": ["var(--vl-font-2xl)", { lineHeight: "1.15" }],
      },

      // ── Border Radius ─────────────────────────────────
      borderRadius: {
        pill: "var(--vl-radius-pill)",
        sm: "var(--vl-radius-sm)",
        md: "var(--vl-radius-md)",
        lg: "var(--vl-radius-lg)",
        xl: "var(--vl-radius-xl)",
        // Shadcn defaults preserved
        DEFAULT: "var(--radius)",
      },

      // ── Box Shadows ───────────────────────────────────
      boxShadow: {
        "vl-sm": "var(--vl-shadow-sm)",
        "vl-md": "var(--vl-shadow-md)",
        "vl-orange": "var(--vl-shadow-orange)",
      },

      // ── Backdrop Blur ─────────────────────────────────
      backdropBlur: {
        glass: "42px",
      },
    },
  },
  plugins: [],
};

export default config;
