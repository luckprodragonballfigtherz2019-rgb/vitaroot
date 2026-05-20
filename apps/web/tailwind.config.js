/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutros (papel crudo, no blanco puro)
        paper: 'var(--paper)',
        'paper-soft': 'var(--paper-soft)',
        'paper-deep': 'var(--paper-deep)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-faint': 'var(--ink-faint)',
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',

        // Marca: verde musgo
        moss: {
          50: 'var(--moss-50)',
          100: 'var(--moss-100)',
          300: 'var(--moss-300)',
          500: 'var(--moss-500)',
          700: 'var(--moss-700)',
          900: 'var(--moss-900)',
        },

        // Acentos
        clay: 'var(--clay)',
        'clay-soft': 'var(--clay-soft)',
        garnet: 'var(--garnet)',
        'garnet-soft': 'var(--garnet-soft)',
        ochre: 'var(--ochre)',
        'ochre-soft': 'var(--ochre-soft)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.32, 0.72, 0.32, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
        spring: 'cubic-bezier(0.5, 1.6, 0.5, 1)',
      },
      transitionDuration: {
        instant: '75ms',
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
        slower: '500ms',
        hero: '800ms',
      },
    },
  },
  plugins: [],
}