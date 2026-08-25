/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Space Neutral System
        "space-black": "#05070D",
        "space-dark": "#080B12",
        "space-surface": "#0D111A",
        "space-card": "rgba(255, 255, 255, 0.03)",
        "space-border": "rgba(255, 255, 255, 0.08)",
        
        // Futuristic Luminous Accents
        "cyan-accent": "#00E5FF",
        "cyan-glow": "#00F2FE",
        "violet-accent": "#8B5CF6",
        "violet-glow": "#A78BFA",
        "mint-accent": "#10B981",
        "mint-glow": "#34D399",
        "coral-accent": "#FF6B6B",

        // Semantic system mapping
        "on-surface-variant": "var(--on-surface-variant, #8C93A4)",
        "primary-container": "var(--primary-container, #00E5FF)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant, #413a91)",
        "background": "var(--background, #05070D)",
        "secondary-container": "var(--secondary-container, #8B5CF6)",
        "on-surface": "var(--on-surface, #F4F6FB)",
        "surface": "var(--surface, #080B12)",
        "surface-container": "var(--surface-container, #0D111A)",
        "surface-container-high": "var(--surface-container-high, #141924)",
        "surface-container-low": "var(--surface-container-low, #080B12)",
        "surface-variant": "var(--surface-variant, #171D2B)",
        "outline-variant": "var(--outline-variant, rgba(255, 255, 255, 0.08))",
        "primary": "var(--primary, #00E5FF)",
        "secondary": "var(--secondary, #8B5CF6)",
        "tertiary": "var(--tertiary, #10B981)",
        "error": "var(--error, #FF5252)",
        "error-container": "var(--error-container, rgba(255, 82, 82, 0.15))",
        "on-error": "#FFFFFF",
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Quicksand"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'cyan-glow': '0 0 30px rgba(0, 229, 255, 0.25)',
        'violet-glow': '0 0 30px rgba(139, 92, 246, 0.25)',
        'mint-glow': '0 0 30px rgba(16, 185, 129, 0.25)',
        'glass': '0 16px 40px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'capsule': '0 20px 50px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out infinite 1.5s',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        }
      }
    },
  },
  plugins: [],
}
