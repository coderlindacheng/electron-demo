# electron-demo

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

如果还是被墙

Windows环境下:
去下面的地址手动下载资源就完事了[electron-builder-binaries](https://github.com/electron-userland/electron-builder-binaries/releases)

MAC环境下:
设置环境变量 ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/" 才能打包成功

npm start       -- 运行程序
npm run dev     -- 研发模式运行程序
npm run dist    -- 打包

## 注意

./src/render/html/index.html 不可以挪位置,且所有html都放在./src/render/html目录,因为主页面的位置是所有子页面的根目录,一动了,rootpath就变了

还有打包的我只配置了Windows的,没有配置其他平台的,偷懒了,哈哈哈哈哈哈哈哈


这不是一个完全的版本,还有些功能没完成的