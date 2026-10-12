import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#070b14',
          panel: '#101827',
          panelAlt: '#0d1422',
          cyan: '#53e6ff',
          violet: '#8b5cf6',
          emerald: '#34d399',
          gold: '#facc15',
          danger: '#ef4444',
        },
      },
      boxShadow: {
        neon: '0 0 30px rgba(83,230,255,0.35)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(83,230,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(83,230,255,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
