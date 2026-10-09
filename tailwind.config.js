/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---------- 瑞士国际主义（International Typographic Style）——当前世界 ----------
        milk: '#FFFFFF', // 白纸地：全站页面底
        leaf: '#FFFFFF', // 工作面：输入与答题选项——与地同白，靠发丝线与灰面板分层
        under: '#F1F1F1', // 灰面板：次级区块与选中底
        rule: '#D9D9D9', // 发丝线：一切轻分界
        ink: '#111111', // 正文墨（白地 ≥17:1）
        ink2: '#555555', // 次级墨（白地 ≥7:1）
        // 路径导色（瑞士世界降为点缀：编号、细条、页签、答题状态，不做大面积底）
        'board-pathway': '#F2B700', // 通路 · 铬黄（01–02）
        'board-deconstruct': '#2A4BD7', // 拆解 · 群青（03）
        'board-encode': '#137574', // 存入 · 青（04–06）
        'board-retrieve': '#357A1E', // 调用 · 草绿（07）
        'board-capstone': '#6B3FA0', // 收官 · 紫罗兰（08）
        errata: '#E34234', // 信号红：勘误描边与标记（非文字 ≥3:1）
        'errata-deep': '#C1301A', // 勘误条底：承载文字（白字 ≥4.5:1）
      },
      fontFamily: {
        // 正文中文衬线保留（阅读面）；标题与界面走 Helvetica 系无衬线（CDN Inter 兜底）
        serif: ["'Noto Serif SC'", "'Source Han Serif SC'", "'Songti SC'", 'SimSun', 'Georgia', 'serif'],
        display: [
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'Inter',
          "'Noto Sans SC'",
          "'Source Han Sans SC'",
          '-apple-system',
          'BlinkMacSystemFont',
          "'PingFang SC'",
          "'Microsoft YaHei'",
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'Inter',
          "'Noto Sans SC'",
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
      keyframes: {
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-7px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-5px)' },
          '60%': { transform: 'translateX(4px)' },
          '80%': { transform: 'translateX(-2px)' },
        },
      },
      animation: {
        shake: 'shake 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
    },
  },
  plugins: [],
};
