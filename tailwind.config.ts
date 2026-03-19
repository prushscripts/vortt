import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vortt: {
          bg:        "#080809",
          sidebar:   "#0D0D10",
          card:      "#111116",
          border:    "rgba(255,255,255,0.07)",
          orange:    "#FF6B2B",
          "orange-dim": "rgba(255,107,43,0.15)",
          text:      "#F8F8FA",
          secondary: "rgba(248,248,250,0.65)",
          muted:     "rgba(248,248,250,0.38)",
          green:     "#22C55E",
          "green-dim": "rgba(34,197,94,0.15)",
          red:       "#F43F5E",
          "red-dim": "rgba(244,63,94,0.15)",
          amber:     "#F59E0B",
          "amber-dim": "rgba(245,158,11,0.15)",
          blue:      "#3B82F6",
          "blue-dim": "rgba(59,130,246,0.15)",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body:    ["var(--font-manrope)", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn:  "10px",
        pill: "100px",
      },
      animation: {
        "slide-up":  "slideUp 0.25s ease-out",
        "fade-in":   "fadeIn 0.2s ease-out",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        slideUp:  { "0%": { transform: "translateY(12px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        fadeIn:   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
      },
    },
  },
  plugins: [],
};
export default config;
