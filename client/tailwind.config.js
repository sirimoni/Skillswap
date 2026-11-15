export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        'hero-sub': 'hsl(var(--hero-sub) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'system-ui', 'sans-serif'],
        heading: ['"General Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: { marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } } },
      animation: { marquee: 'marquee 20s linear infinite' },
    },
  },
  plugins: [],
};
