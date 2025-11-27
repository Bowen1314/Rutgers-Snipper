# Rutgers Snipper 部署指南 [English](README_EN.md)

**中文** |

这是一个用于监控 Rutgers 课程状态的 Web 应用程序，包含 Python (FastAPI) 后端和 React (Vite) 前端。当监控的课程 Section 开启时，系统会播放声音提醒。

## 📋 环境要求

- **Python**: 3.8 或更高版本
- **Node.js**: 16 或更高版本
- **npm**: 通常随 Node.js 一起安装
- **操作系统**: macOS (推荐，支持 `afplay` 音频播放), Linux, Windows

## 🚀 快速开始

### 1. 初始化环境

在项目根目录下运行以下命令来安装所有依赖：

```bash
# 1. 设置后端虚拟环境并安装依赖
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn requests pydantic

# 2. 安装前端依赖
cd ../frontend
npm install

# 3. 返回根目录
cd ..
```

### 2. 准备音频文件

确保项目根目录下有一个名为 `music.mp3` 的文件。当课程开启时，系统会播放此文件。
路径: `/Users/bowenrui/Google snipper/music.mp3`

### 3. 启动应用

#### macOS / Linux
在项目根目录下，直接运行启动脚本：
```bash
chmod +x run.sh  # 如果是第一次运行，给予执行权限
./run.sh
```

#### Windows
1. 双击运行 `install.bat` 安装依赖（首次运行）。
2. 双击运行 `run.bat` 启动应用。

此脚本会同时启动：
- **后端 API**: http://localhost:8000
- **前端页面**: http://localhost:5173 (会自动打开或在终端显示链接)

## 🛠️ 功能使用

1. **添加课程**: 
   - 输入课程代码 (如 `11:375:101` 或 `375:101`)
   - 或输入 Index (如 `10193`)
   - 点击 "添加"

2. **开始监控**:
   - 添加课程后，点击 "开始监控" 按钮。
   - 系统将每 30 秒（默认）扫描一次。

3. **声音提醒**:
   - 当任何监控的 Section 从 **Closed** 变为 **Open** 时，系统会自动播放 `music.mp3`。

4. **查看详情**:
   - 课程卡片会显示该课程下所有的 Section 及其状态（Open/Closed）和讲师信息。

5. **中英文切换**:
   - 点击顶部导航栏的 "CN/EN" 按钮可在中文和英文界面之间切换。

## ⚠️ 常见问题

- **端口占用**: 如果启动失败提示端口被占用，请尝试关闭占用端口的进程或重启电脑。
- **声音不播放**: 
  - 确认 `music.mp3` 文件存在。
  - 确认终端有权限播放音频。
  - 目前音频播放主要针对 macOS (`afplay`) 优化。

## 📂 目录结构

```
Google snipper/
├── backend/            # Python FastAPI 后端
│   ├── main.py        # API 入口
│   ├── sniper.py      # 核心监控逻辑
│   └── models.py      # 数据模型
├── frontend/           # React 前端
│   ├── src/           # 源代码
│   └── package.json   # 前端依赖
├── run.sh             # 一键启动脚本
├── music.mp3          # 提示音文件
└── README.md          # 本文档
```
