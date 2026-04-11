# 🚀 GitHub Pages 部署指南 (学海秘境)

由于本项目是一个纯前端项目（基于 Vite + React + TypeScript），你可以非常方便地将其免费部署在 **GitHub Pages** 上。

---

## 1. 准备工作

在开始之前，请确保你的电脑上已安装以下工具：
*   **Node.js** (建议版本 18.0 或更高)
*   **Git**
*   **GitHub 账号**

---

## 2. 第一步：创建 GitHub 仓库

1.  登录你的 GitHub。
2.  点击右上角的 `+` -> `New repository`。
3.  给仓库起个名字（例如：`scholars-dungeon`）。
4.  设为 `Public`（公开），然后点击 `Create repository`。

---

## 3. 第二步：本地代码配置

在你的项目根目录下，你需要进行一些简单的配置：

### 1. 安装部署工具
打开终端（Terminal），运行以下命令：
```bash
npm install gh-pages --save-dev
```

### 2. 修改 `package.json`
在 `package.json` 中添加以下内容：
*   **homepage**: 设置为 `https://<你的用户名>.github.io/<仓库名>/`
*   **scripts**: 添加 `predeploy` 和 `deploy` 脚本。

示例：
```json
{
  "name": "react-example",
  "homepage": "https://yourusername.github.io/scholars-dungeon/",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  ...
}
```

### 3. 修改 `vite.config.ts`
为了确保静态资源（图片、JS、CSS）能正确加载，你需要设置 `base` 路径。
打开 `vite.config.ts`，修改如下：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/scholars-dungeon/', // 这里必须和你的仓库名一致
})
```

---

## 4. 第三步：上传代码并部署

在终端依次运行以下命令：

1.  **初始化 Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **关联远程仓库**:
    ```bash
    git remote add origin https://github.com/你的用户名/scholars-dungeon.git
    git branch -M main
    git push -u origin main
    ```

3.  **执行部署**:
    ```bash
    npm run deploy
    ```
    *这个命令会自动打包项目并上传到仓库的 `gh-pages` 分支。*

---

## 5. 第四步：在 GitHub 上开启页面

1.  进入你的 GitHub 仓库页面。
2.  点击 `Settings` -> `Pages`。
3.  在 `Build and deployment` 下的 `Branch` 部分，确保选择了 `gh-pages` 分支和 `/ (root)` 文件夹。
4.  点击保存。稍等几分钟，你就可以通过 `homepage` 里的链接访问你的网页了！

---

## 🔑 关于 API 调用 (如 Gemini API)

如果你在项目中使用了 Gemini API 或其他第三方 API，在 GitHub Pages 这种**静态网页**中，有几点需要注意：

### 1. 安全风险 (重要！)
*   **不要**直接在代码里硬编码（Hardcode）你的 API Key。因为任何人都可以通过浏览器的“检查元素”看到你的密钥。
*   **推荐做法**：在网页的“设置”页面提供一个输入框，让用户输入他们自己的 API Key，并保存在浏览器的 `localStorage` 中。

### 2. 环境变量 (仅限构建时)
如果你一定要在构建时注入 Key，可以使用 Vite 的环境变量：
1.  创建 `.env` 文件，写入 `VITE_GEMINI_API_KEY=你的密钥`。
2.  在代码中通过 `import.meta.env.VITE_GEMINI_API_KEY` 调用。
3.  **注意**：这依然是不安全的，因为密钥会被打包进 JS 文件中。

### 3. 如果需要后端逻辑
GitHub Pages 不支持运行 Node.js 后端。如果你需要隐藏 API Key，建议：
*   使用 **Vercel** 或 **Netlify** 部署（它们支持 Serverless Functions，可以写简单的后端接口）。
*   或者使用 **Cloudflare Workers** 作为中转代理。

---

## 🛠 常见问题排查
*   **白屏**：通常是 `vite.config.ts` 里的 `base` 路径没设对。
*   **404**：GitHub Pages 刷新页面可能会报 404（因为是单页应用 SPA）。解决方法是在 `public` 文件夹下添加一个 `404.html` 并重定向到 `index.html`。

---

**祝你的“学海秘境”顺利上线！🚀**
