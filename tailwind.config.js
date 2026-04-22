/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'sans-serif'
  			],
			display: [
				'Inter',
				'system-ui',
				'sans-serif'
			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'Consolas',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			'4xl': '2rem',
  			'5xl': '2.5rem',
  			lg: '1rem',
  			md: '0.75rem',
  			sm: '0.5rem'
  		},
  		colors: {
  			background: '#f5f5f5',
  			foreground: '#1e293b',
        surface: '#e0e0e0',
  			muted: {
  				DEFAULT: '#cbd5e1',
  				foreground: '#64748b'
  			},
  			primary: {
  				DEFAULT: '#10b981',
  				foreground: '#ffffff'
  			},
  			border: '#d1d9e6',
  			ring: '#10b981',
  			card: {
  				DEFAULT: '#f5f5f5',
  				foreground: '#1e293b'
  			},
  			popover: {
  				DEFAULT: '#f5f5f5',
  				foreground: '#1e293b'
  			},
  			secondary: {
  				DEFAULT: '#6366f1',
  				foreground: '#ffffff'
  			},
  			accent: {
  				DEFAULT: '#f8f9ff',
  				foreground: '#1e293b'
  			},
  			destructive: {
  				DEFAULT: '#ef4444',
  				foreground: '#ffffff'
  			},
  			input: '#f1f5f9',
  		},
  		boxShadow: {
  			'nm-flat': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
  			'nm-inset': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        'nm-flat-sm': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        'nm-inset-sm': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'slide-up': {
  				'0%': { transform: 'translateY(20px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			}
  		},
  		animation: {
  			'fade-in': 'fade-in 0.6s ease-out',
  			'slide-up': 'slide-up 0.4s ease-out',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}