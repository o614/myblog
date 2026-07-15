# 不要艾特我 · 数字生活笔记

[290935.xyz](https://290935.xyz/) 是一个中文数字生活博客，主要记录 Apple ID、App Store、礼品卡、AI 订阅、Google 账号和数字工具的实用经验。

## 本地开发

项目需要 Node.js 22.12 或更高版本，以及 pnpm。

```bash
pnpm install
pnpm dev
```

本地开发地址默认为 `http://localhost:4321`。

## 常用命令

```bash
pnpm dev             # 启动开发服务器
pnpm build           # 类型检查并生成生产版本
pnpm preview         # 预览生产构建
pnpm lint            # 检查代码规范
pnpm format:check    # 检查代码格式
pnpm optimize:images # 优化文章图片
pnpm generate:brand  # 根据 favicon.svg 重新生成桌面图标
```

## 内容结构

- 文章：`src/content/posts/`
- 独立页面：`src/content/pages/`
- 文章图片：`public/images/posts/`
- 站点名称、作者和社交链接：`astro-paper.config.ts`
- 分享图模板：`src/pages/og.png.ts` 和 `src/pages/posts/[...slug]/index.png.ts`
- 移动端桌面配置：`public/site.webmanifest`

发布文章前建议至少运行一次：

```bash
pnpm run lint
pnpm run format:check
pnpm run build
```

## 部署

项目构建产物位于 `dist/`，可以部署到 Cloudflare Pages 或其他静态网站托管服务。生产域名为 [290935.xyz](https://290935.xyz/)。

## 许可与致谢

站点代码基于开源主题 [AstroPaper](https://github.com/satnaing/astro-paper) 修改，并继续遵循仓库中的 MIT License。博客文章、原创图片和品牌素材的权利归内容作者所有，另有说明的除外。
