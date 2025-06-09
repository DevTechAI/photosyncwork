
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
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
        royal: {
          DEFAULT: "hsl(var(--royal))",
          foreground: "hsl(var(--royal-foreground))",
          light: "hsl(var(--royal-light))",
          dark: "hsl(var(--royal-dark))",
        },
        velvet: {
          DEFAULT: "hsl(var(--velvet))",
          dark: "hsl(var(--velvet-dark))",
          light: "hsl(var(--velvet-light))",
          muted: "hsl(var(--velvet-muted))",
          soft: "hsl(var(--velvet-soft))",
          whisper: "hsl(var(--velvet-whisper))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      safelist: [
        'border-blue-500',
        'border-green-500',
        'border-purple-500',
        'border-indigo-500'
      ]
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    'border-blue-500',
    'border-green-500',
    'border-purple-500',
    'border-indigo-500'
  ]
} satisfies Config;
