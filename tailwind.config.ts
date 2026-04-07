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
        base: '#0b0d10',
        card: '#13161b',
        border: '#262b33',
        accent: '#d9a441',
      },
      boxShadow: {
        soft: '0 8px 28px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
