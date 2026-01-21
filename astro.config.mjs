// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
// 安全说明: Astro 4.x 存在 server islands XSS 漏洞 (CVE)，
// 但本项目使用 output: 'static' 纯静态生成模式，
// 不使用 server islands 功能，因此该漏洞不影响本项目。
// 如需升级到 5.15.8+，请参考 Astro 迁移指南。
export default defineConfig({
  integrations: [
    mdx(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
});
