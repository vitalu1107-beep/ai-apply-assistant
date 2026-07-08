# AI 智能投递助手

一个用于高频求职投递前的生成与复制工作台静态原型。

当前版本聚焦在前端 UI：用户粘贴简历文本和岗位 JD，选择投递平台、投递对象和强调方向后，页面展示岗位匹配分析、分对象打招呼话术、简历微调建议和面试前问题预测的 mock 结果。

## 当前状态

- 仅为静态 UI 原型
- 未接 API
- 未接火山方舟
- 未接 OpenAI
- 未处理 API Key
- 未接数据库
- 未做登录注册
- 未做自动投递
- 未做 PDF 上传
- 使用 mock 数据展示效果

## 技术栈

- Next.js
- TypeScript
- React
- lucide-react
- CSS

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

## 重要说明

这个项目目前只是前端效果页。

GitHub 仓库用于托管代码，GitHub Actions + GitHub Pages 用于把静态页面发布成可访问的网址。

## 项目定位

这是一个高频投递前的生成与复制工作台，不是求职管理系统，也不是自动投递工具。

核心目标是帮助用户更快完成：

- 岗位 JD 粘贴与场景选择
- 分对象打招呼话术查看与复制
- 岗位匹配分析查看
- 简历微调建议查看
- 面试前问题预判
