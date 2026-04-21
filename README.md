## Qdesign 高还原实现

基于 `Next.js 16 + TypeScript + TailwindCSS + Framer Motion` 的双页面高还原项目。

### 页面说明

- `/`：首页（Hero、Commands、In Action、Get Started、Changelog、FAQ）
- `/cheatsheet`：命令速查页（分类筛选、关键词搜索、复制命令、加载骨架）

### 当前实现能力

- **结构还原**：核心区块结构与导航体系已完成
- **交互还原**：锚点滚动、移动端菜单、FAQ 折叠、筛选与搜索
- **动效还原**：分区入场、滚动进度反馈、卡片微交互
- **资源策略**：缺失素材采用可替换占位

### 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

### 目录结构

- `app/page.tsx`：首页路由入口
- `app/cheatsheet/page.tsx`：Cheatsheet 路由入口
- `app/cheatsheet/loading.tsx`：Cheatsheet 加载骨架
- `components/site/home-page.tsx`：首页主视图
- `components/site/cheatsheet-page.tsx`：Cheatsheet 主视图
- `data/site-content.ts`：页面内容数据源

### 后续建议（可继续迭代）

- 替换授权字体、图标与品牌素材
- 基于目标站做逐断点像素比对
- 收敛动效时序曲线（统一 easing 与 delay）
- 增补 SEO 与社交分享元数据
