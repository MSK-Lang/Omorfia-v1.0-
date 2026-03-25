import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      colors: {
        "naturals-purple": "#5B2D8E",
        "naturals-orange": "#E8611A",
        "midnight-purple": "#0F051D",
        "deep-purple": "#1A0B2E",
        "sephora-black": "#000000",
        primary: "#5B2D8E",
        accent: "#E8611A",
      },
      backgroundImage: {
        "prestige-gradient": "linear-gradient(180deg, #0F051D 0%, #1A0B2E 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out infinite 2s",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
