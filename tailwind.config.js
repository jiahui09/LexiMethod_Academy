/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 霓虹色板
        neon: '#00E5FF',
        violet: '#7C4DFF',
        pink: '#FF4D9D',
        success: '#00E676',
        warn: '#FFB300',
        danger: '#FF4D6D',
        // 背景渐变端点
        abyss: '#0B1020',
        deep: '#111936',
        ink: '#070B18',
        // 语义表面
        surface: 'rgba(255,255,255,0.06)',
        hairline: 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        // 规格约束：只用系统字体栈，不加载任何外部字体文件（离线可用 + 零请求）
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'Segoe UI'",
          'Roboto',
          "'PingFang SC'",
          "'Microsoft YaHei'",
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'Segoe UI'",
          'Roboto',
          "'PingFang SC'",
          "'Microsoft YaHei'",
          'system-ui',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "'Liberation Mono'", 'monospace'],
      },
      borderRadius: {
        glass: '24px',
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,229,255,0.18), 0 0 64px rgba(124,77,255,0.12)',
        'glow-sm': '0 0 12px rgba(0,229,255,0.22)',
        'glow-lg': '0 0 48px rgba(0,229,255,0.25), 0 0 120px rgba(124,77,255,0.18)',
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        neon: '0 0 20px rgba(0,229,255,0.45)',
      },
      backgroundImage: {
        'page-gradient':
          'radial-gradient(1200px 700px at 15% -10%, rgba(124,77,255,0.20), transparent 60%), radial-gradient(1000px 600px at 100% 0%, rgba(0,229,255,0.14), transparent 55%), linear-gradient(180deg, #0B1020 0%, #111936 100%)',
      },
      keyframes: {
        aurora: {
          '0%,100%': { transform: 'translate3d(-4%,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%,-3%,0) scale(1.08)' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-7px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-5px)' },
          '60%': { transform: 'translateX(4px)' },
          '80%': { transform: 'translateX(-2px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.55' },
          '100%': { transform: 'scale(3.2)', opacity: '0' },
        },
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '300% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'wave-bounce': {
          '0%,100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3.2s ease-in-out infinite',
        shake: 'shake 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        flow: 'flow 3.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 9s linear infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
