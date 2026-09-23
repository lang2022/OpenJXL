# 新站克隆 Checklist（30 分钟套壳，基于 Open JXL V1）

目标：用本仓库复制一个同构工具站（如 HEIC 查看、JSON 格式化）。
全程 ASCII 文件名；含中文的文件只用 Write/编辑器改，绝不用 PowerShell 管道重写。

## 0. 准备（5 分钟）

- [ ] 新词已验证：月搜 1 万–20 万，首页无巨头（iLovePDF/CloudConvert 级别）
- [ ] 复制整个仓库到新目录，删 `dist/`、`node_modules/`（`npm install` 重装）
- [ ] `npm run build` 确认基线通过

## 1. 站点身份（5 分钟）

- [ ] `astro.config.mjs`：`site` 改为新站占位域（沿用 `https://example.com` 写法，发版再换真域）
- [ ] `src/i18n.ts`：品牌名、tagline、文案 key 按新工具改
- [ ] `src/layouts/Base.astro`：logo 文字、JSON-LD `name/url`、Plausible `data-domain`、footer SEO 句
- [ ] `public/favicon.svg`：换字母/配色（SVG 文本节点改两处即可）
- [ ] `public/site.webmanifest`：name/short_name/description/start_url/theme_color

## 2. 页面与路由（10 分钟）

路由保持 4 页 × 2 语言结构，只换文案与关键词：

- [ ] `src/pages/index.astro` + `src/pages/zh/index.astro`：hero、H1、intro 段（含新词英文名 + 中文叫法各 ≥2 处）、FAQ（首条 What is / 是什么 + Is it free / 免费吗）
- [ ] how-to 页 ×2：Title/H1/FAQ 按“how to open X / X 怎么打开”重写，CTA 横幅链回首页
- [ ] support 页 ×2：改检测逻辑或删检测、改 verdict 文案（非浏览器检测类工具可改为特性对照表）
- [ ] privacy 页 ×2：邮箱、统计说明照搬，仅改工具名
- [ ] `public/sitemap.xml`：8 个 URL 路径与新路由对齐
- [ ] `public/robots.txt`：Sitemap 换新域（发版时）

## 3. 工具逻辑（5 分钟，纯前端类直接复用；解码类替换）

- [ ] `public/viewer.js`：文案字典换新工具话术；解码/处理函数替换，其余（拖放/粘贴/导出/埋点/状态条）不动
- [ ] `public/jxl-worker.js` + `public/jxl/`：按需替换为新 wasm 或删除（纯 JS 工具不需要 Worker 可直调）
- [ ] `public/fixtures/` + `scripts/gen-fixtures.mjs`：换新测试样张（禁止编造字节，用真实文件）
- [ ] `scripts/self-test.mjs`：换新断言后 `node scripts/self-test.mjs` 通过

## 4. 视觉与 SEO 收尾（5 分钟）

- [ ] `public/site.css`：只改 `:root` 品牌色两处（`--brand/--brand2`），其余不动
- [ ] `public/og.png`：1200×630、200KB 内覆盖
- [ ] `npm run build` 通过；依次跑：
  - [ ] `node scripts/check-ids.mjs`（ID 全对）
  - [ ] `node scripts/seo-audit.mjs`（ALL PASS，Title/H1 含新词、无单写缩写污染）
  - [ ] `node scripts/boilerplate-audit.mjs`（PASS）
- [ ] 全仓搜旧品牌词残留：`grep 旧词 src public *.md`，零命中

## 5. 发版（绑域当天）

- [ ] 全局替换占位域 → 真域（含 `site`、canonical 自动跟随、JSON-LD `url`、sitemap、robots、Plausible `data-domain`、隐私页邮箱）
- [ ] 部署（Vercel/Cloudflare Pages，`npm run build` → `dist`）
- [ ] GSC 提交 sitemap；换域后重跑三审计脚本
- [ ] 首周只盯一件事：核心动作计数（如 preview_success 对应事件）是否在涨

## 红线（复述 1.4 精神，新站同样适用）

- 单文件/单任务起步，不批量、不账号、不广告（6 个月内）
- 解码/处理只在本地，不 POST 文件到任何 API
- 不给指向不存在资源的生产代码（如无回退图的 picture 片段）
