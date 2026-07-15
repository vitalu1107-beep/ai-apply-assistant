# AI 智能投递助手

一个用于高频求职投递前的生成与复制工作台原型。

当前版本聚焦在前端工作台和 `/api/generate` 生成流程：用户粘贴简历文本和岗位 JD，选择投递平台、投递对象和强调方向后，页面展示岗位筛选判断、分对象打招呼话术、简历微调建议和面试前问题预测。

## 当前状态

- UI 原型和本地 API 流程
- 已预留火山方舟 / 豆包 OpenAI-compatible 调用
- 未接 OpenAI
- API Key 只从服务端环境变量读取
- 未接数据库
- 未做登录注册
- 未做自动投递
- 未做 PDF 上传
- 支持 mock 模式和真实 LLM 模式

## 技术栈

- Next.js
- TypeScript
- React
- lucide-react
- openai
- CSS

## 本地接入火山方舟 API

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

在 `.env.local` 中填写：

```bash
LLM_PROVIDER=volcengine
LLM_API_KEY=你的火山方舟 API Key
LLM_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
LLM_MODEL=doubao-seed-2-1-turbo-260628
GENERATE_MODE=llm
```

注意：

- 不要提交 `.env.local`
- 不要把 API Key 写进前端代码
- 不要把 API Key 写进 GitHub
- 不要使用 `NEXT_PUBLIC_` 保存 API Key
- GitHub Pages 只能作为静态展示
- 真实 API 调用需要本地运行，或部署到支持服务端函数的平台，例如 Vercel

如果只想调试 UI、不调用真实模型，可以使用 mock 模式：

```bash
GENERATE_MODE=mock
```

## 本地预览

先安装依赖：

```bash
npm install
```

启动本地开发服务：

```bash
npm run dev
```

然后在浏览器打开：

```text
http://localhost:3000
```

如果 `localhost` 打不开，可以试试：

```text
http://127.0.0.1:3000
```

## 常用命令

```bash
npm run dev
```

启动本地开发服务。

```bash
npm run build
```

检查项目是否可以正常构建。

```bash
npm run test
```

运行静态 UI 约束检查。

## GitHub Actions 部署

项目已配置 GitHub Actions + GitHub Pages。

推送到 `main` 分支后，GitHub Actions 会自动：

1. 安装依赖
2. 运行静态 UI 检查
3. 构建 Next.js 静态站点
4. 发布到 GitHub Pages

首次使用前，需要在 GitHub 仓库中确认：

1. 进入 `Settings`
2. 进入 `Pages`
3. 在 `Build and deployment` 中将 `Source` 设为 `GitHub Actions`

部署成功后，页面地址通常是：

```text
https://vitalu1107-beep.github.io/ai-apply-assistant/
```

## Vercel 部署说明

当前项目有两种访问方式：

1. GitHub Pages
   - 用于静态 UI 展示
   - 不适合真实调用火山方舟 API
   - 路径为 `/ai-apply-assistant/`

2. Vercel
   - 用于真实 API 可用版
   - 支持 `/api/generate` 服务端接口
   - API Key 通过 Vercel Environment Variables 配置

在 Vercel 中需要配置以下环境变量：

```bash
LLM_PROVIDER=volcengine
LLM_API_KEY=your_volcengine_api_key
LLM_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
LLM_MODEL=doubao-seed-2-1-turbo-260628
GENERATE_MODE=llm
```

说明：

- `LLM_API_KEY` 由用户自己填写真实火山方舟 API Key
- 不要提交 `.env.local`
- 不要把 API Key 写入 GitHub
- 不要使用 `NEXT_PUBLIC_LLM_API_KEY`
- 修改 Vercel 环境变量后，需要重新部署项目
- 如果想不调用真实模型调试，可以设置 `GENERATE_MODE=mock`

上线后检查：

- Vercel Production 部署成功
- 打开 Vercel 域名页面正常
- 不填写 JD 时，点击生成提示“请先粘贴岗位 JD。”
- 未配置 `LLM_API_KEY` 时，接口返回“模型服务未配置，请检查环境变量。”
- 配置完整环境变量后，点击生成可以真实调用火山方舟
- 右侧结果不是固定 mock，而是根据 JD 变化
- 保存到投递记录正常
- 浏览器前端源码中看不到 `LLM_API_KEY`
- Vercel Function Logs 不输出 API Key

## 重要说明

GitHub Pages 使用静态导出，只适合作为展示版；`/api/generate` 这种服务端接口不会在 GitHub Pages 上运行。

如果要在线使用真实火山方舟 / 豆包 API，需要部署到 Vercel，并在 Vercel 项目中配置环境变量。

GitHub 仓库用于托管代码，GitHub Actions + GitHub Pages 用于把静态页面发布成可访问的网址。

## 项目定位

这是一个高频投递前的生成与复制工作台，不是求职管理系统，也不是自动投递工具。

核心目标是帮助用户更快完成：

- 岗位 JD 粘贴与场景选择
- 分对象打招呼话术查看与复制
- 岗位匹配分析查看
- 简历微调建议查看
- 面试前问题预判
