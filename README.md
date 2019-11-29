# electron-quick-start

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install

如果还是被墙,去下面的地址手动下载资源就完事了[electron-builder-binaries](https://github.com/electron-userland/electron-builder-binaries/releases)

npm start       -- 运行程序
npm run dev     -- 研发模式运行程序
npm run dist    -- 打包