import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                // sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                poppins: ['var(--font-poppins)'],
            },
            colors: {
                secondary: colors.green,

                primary: {
                  500: '#624CF5',
                  50: ' #F6F8FD',
                  DEFAULT: '#5F9DF7',
                  foreground: 'hsl(var(--primary-foreground))',
                },
                coral: {
                  500: '#15BF59',
                },
        
                grey: {
                  600: '#545454', // Subdued - color name in figma
                  500: '#757575',
                  400: '#AFAFAF', // Disabled - color name in figma
                  50: '#F6F6F6', // White Grey - color name in figma
                },
                black: '#000000',
                white: '#FFFFFF',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                foreground: 'hsl(var(--foreground))',
                // secondary: {
                //   DEFAULT: 'hsl(var(--secondary))',
                //   foreground: 'hsl(var(--secondary-foreground))',
                // },
                destructive: {
                  DEFAULT: 'hsl(var(--destructive))',
                  foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                  DEFAULT: 'hsl(var(--muted))',
                  foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                  DEFAULT: 'hsl(var(--accent))',
                  foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                  DEFAULT: 'hsl(var(--popover))',
                  foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                  DEFAULT: 'hsl(var(--card))',
                  foreground: 'hsl(var(--card-foreground))',
                },
              },
        },
    },
    plugins: [],
};
