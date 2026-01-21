/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif SC', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 角色代表色 - 可根据需要扩展
        character: {
          indigo: '#4f46e5',    // 靛蓝
          crimson: '#dc2626',   // 绯红
          emerald: '#059669',   // 翡翠
          amber: '#d97706',     // 琥珀
          violet: '#7c3aed',    // 紫罗兰
          cyan: '#0891b2',      // 青色
          rose: '#e11d48',      // 玫红
          slate: '#475569',     // 石板灰
        },
        // 关系类型配色
        relation: {
          pure: '#ec4899',      // 纯爱 - 粉色
          twisted: '#7c3aed',   // 扭曲 - 紫色
          utilize: '#f59e0b',   // 利用 - 琥珀
          enemy: '#ef4444',     // 宿敌 - 红色
          ally: '#22c55e',      // 盟友 - 绿色
        },
        // 标签类型配色
        tag: {
          trope: '#8b5cf6',     // 套路标签
          vibe: '#06b6d4',      // 氛围标签
          status: '#10b981',    // 状态标签
          warning: '#f43f5e',   // 警告标签
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            color: 'inherit',
            a: {
              color: '#4f46e5',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            blockquote: {
              borderLeftColor: '#4f46e5',
              fontStyle: 'italic',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
