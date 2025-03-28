# 多智能体办公场景模拟系统

这是一个基于React和Unity的多智能体办公场景模拟系统前端项目。

## 项目结构

```
├── src/
│   ├── pages/           # 页面组件
│   │   ├── HomePage.tsx # 首页
│   │   └── SimulationPage.tsx # 模拟页面
│   ├── server/          # 后端服务
│   │   └── index.ts     # Express服务器
│   └── App.tsx          # 应用入口
├── messages/            # 消息记录存储目录
├── package.json         # 项目配置
└── README.md           # 项目说明
```

## 功能特点

- 响应式设计的首页，展示项目标题和Agent动画
- 模拟页面分为左右两部分：
  - 左侧：实时对话界面，支持用户输入和Agent响应
  - 右侧：Unity场景展示区域
- 自动保存对话记录到JSON文件
- 支持与Unity和Agent系统的集成

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动前端开发服务器：
```bash
npm start
```

3. 启动后端服务器：
```bash
npm run server
```

前端将在 http://localhost:3000 运行，后端API将在 http://localhost:3001 运行。

## 开发说明

- 使用TypeScript进行开发
- 使用Material-UI组件库
- 使用React Router进行路由管理
- 使用Express提供后端API服务

## 待完成功能

- [ ] Unity场景集成
- [ ] Agent系统集成
- [ ] 实时通信功能
- [ ] 用户认证系统 