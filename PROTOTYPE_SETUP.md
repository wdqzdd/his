# 血液净化专科系统原型运行说明

## 项目说明

本项目是血液净化专科系统原型图工程，使用 Vue 3、TypeScript、Vite 和 Element Plus 实现。原型覆盖登录、身份选择、工作站切换、左侧菜单、页签、多工作站业务页面和闭环示例数据。

## 环境要求

请先安装以下环境：

- Node.js：建议 20.x 或更高版本
- pnpm：建议 9.x 或更高版本
- 操作系统：Windows、macOS 或 Linux 均可

检查版本：

```powershell
node -v
pnpm -v
```

如果未安装 pnpm，可执行：

```powershell
npm install -g pnpm
```

## 安装依赖

进入项目目录：

```powershell
cd D:\Work\his
```

安装依赖：

```powershell
pnpm install
```

## 本地运行

启动开发服务：

```powershell
pnpm dev
```

启动后终端会显示本地访问地址，通常是：

```text
http://localhost:5173/
```

浏览器打开该地址后，先进入登录页，点击登录后进入身份选择页。选择身份后进入对应工作站。右上角“我的工作站”可切换当前用户拥有的其他身份。

## 构建验证

执行生产构建：

```powershell
pnpm build
```

该命令会先运行 TypeScript 类型检查，再执行 Vite 打包。构建产物输出到：

```text
dist/
```

## 预览构建结果

构建完成后可运行：

```powershell
pnpm preview
```

终端会显示预览地址，通常是：

```text
http://localhost:4173/
```

## 常见问题

- 如果端口被占用，Vite 会自动尝试使用其他端口，请以终端输出为准。
- 如果依赖安装失败，先确认 Node.js 和 pnpm 版本，再重新执行 `pnpm install`。
- `pnpm build` 可能提示 chunk 体积较大，这是当前原型页面较多导致的构建警告，不影响运行。
- 登录和身份选择是原型流程，当前没有连接真实后端接口。
