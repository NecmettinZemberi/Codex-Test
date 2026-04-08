import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0A',
        surface: '#121212',
        surface2: '#181818',
        border: '#2A2A2A',
        text: '#F3F3F3',
        muted: '#A1A1AA',
        accent: '#E7E5E4',
        warm: '#8F6B3B',
      },
      boxShadow: {
        soft: '0 12px 28px rgba(0, 0, 0, 0.18)',
      },
      borderRadius: {
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1rem',
      },
      fontFamily: {
        body: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
