# 我的博客

这是一个基于 AstroPaper 的简洁个人博客，网站地址为 [290935.xyz](https://290935.xyz/)。文章和关于页面可以通过 [Pages CMS](https://app.pagescms.org/) 的图文编辑器管理，无需手动排版或编辑 Markdown 文件。

## 写作与发布

1. 打开 [Pages CMS](https://app.pagescms.org/)，用有权访问 `o614/myblog` 的 GitHub 账号登录并选择该仓库。
2. 在「文章」中新建文章，填写标题、发布时间和摘要，然后在「正文」中直接编辑文字、标题、列表、链接或图片。
3. 需要稍后发布时开启「草稿」；准备公开时关闭草稿并保存。Pages CMS 会将内容保存到 GitHub 仓库，网站由现有部署流程更新。
4. 在「关于页面」中可直接修改个人介绍。

编辑器字段和图片目录由仓库根目录的 `.pages.yml` 配置。文章会写入 `src/content/posts/`，上传图片会写入 `public/images/posts/`。示例文章可随时在后台删除。

## 本地开发

需要 Node.js 22.12 或更新版本及 pnpm。

```bash
pnpm install
pnpm dev
```

提交代码前可以运行：

```bash
pnpm lint
pnpm format:check
pnpm build
```

站点名称、作者和链接位于 `astro-paper.config.ts`。代码基于 [AstroPaper](https://github.com/satnaing/astro-paper) 修改，遵循仓库中的 MIT License。
