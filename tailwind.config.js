/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---------- 压膜活页手册（Acetate Manual，seed 9f19875c）——当前世界 ----------
        milk: '#F4F1E7', // 牛奶压膜地：全站页面底
        leaf: '#FBF9F2', // 顶层透明页：当前阅读页 / 输入 / 答题选项
        under: '#EDE8DA', // 下层页：次级区块底
        rule: '#CFC7B2', // 发丝线：一切分界
        ink: '#17140E', // 正文墨（奶白地 ≥15:1；接管旧深色壳 ink 名位）
        ink2: '#57503F', // 次级墨（奶白地 ≥7:1）
        // 卡板色轮（四段路径，一章一色满强度）
        'board-pathway': '#F2B700', // 通路 · 铬黄（01–02）
        'board-deconstruct': '#2A4BD7', // 拆解 · 群青（03）
        'board-encode': '#137574', // 存入 · 青（04–06）
        'board-retrieve': '#357A1E', // 调用 · 草绿（07）
        'board-capstone': '#6B3FA0', // 收官 · 紫罗兰（08）
        errata: '#E34234', // 朱红勘误：描边与标记（非文字 ≥3:1）
        'errata-deep': '#C1301A', // 勘误条底：承载文字（白字 ≥4.5:1）
      },
      fontFamily: {
        // 压膜活页手册：正文中文衬线（字体 CDN 已放开，系统宋体兜底，离线可读）
        serif: ["'Noto Serif SC'", "'Source Han Serif SC'", "'Songti SC'", 'SimSun', 'Georgia', 'serif'],
        display: [
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
