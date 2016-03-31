# Amaze UI Touch Starter Kit

[Amaze UI Touch](https://github.com/amazeui/amazeui-touch) 快速上手套件，基于 React、Amaze UI Touch、React Router 及 Gulp 开发 SPA。

**套件中目前只包含客户部代码，亦未包含 Flux、Redux 等框架**。

## 目录结构

项目文件放在 `app` 目录下：

```
.app
├── humans.txt
├── i              // 图片
├── index.html     // 入口 HTML
├── js             // JS
├── style           // 样式文件（编译任务中设置的是 Sass，可以自行改用其他）
├── manifest.json
├── manifest.webapp
└── robots.txt
```

## 使用说明

### 环境配置

- 安装 [Node.js](https://nodejs.org/en/download/)
- 模块编译环境配置：[点击查看](https://github.com/nodejs/node-gyp#installation)

### 全局安装 gulp：

```
npm install gulp -g
```

### 安装开发依赖

1. 克隆或下载本项目代码；
2. 进入项目目录，执行 `npm install`；

### 开发

```
gulp
```

或者

```
npm start
```

### 生产环境构建

设置 Node 环境变量为 `production` 后，HTML 中引用的 CSS 和 JS 会替换为 minify 的版本。

```
npm run build
```
