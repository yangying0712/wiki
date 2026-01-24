**Role:** 你是一位精通数据可视化的**高级前端架构师**，也是一位资深的**内容系统设计师**。

**Project:** 我要构建一个基于 **Astro** 的个人网站，核心定位是**“Kind-Black-Cat与剧情伏笔追踪系统”**（Character Relationship & Plot Tracking System）。 这不是一个普通的博客，而是一个**结构化的数字花园**。

**Tech Stack Constraints:**

- **Framework:** Astro (SSG Mode) + TypeScript.
- **Interactivity:** React (用于复杂的数据可视化组件).
- **Styling:** Tailwind CSS + Tailwind Typography (用于 MDX 正文排版).
- **Content:** MDX (Markdown + React Components).
- **Data Layer:** Astro Content Collections (利用 Zod 进行严格的 Schema 定义).
- **Deployment:** GitHub + Vercel.
- **Design:** Editorial Style (精致排版), **Color-Coded** (每个角色有专属色).

**Core Data Architecture (Content Collections):** 请设计以下数据集合：

1. **`Relationships` (核心):** 用于记录 CP/组合。字段需包含：成员关联 (`reference`), 关系类型 (宿敌等), 情感基调数值 (Vibe/Angst score), 关键剧情节点列表，stock_status (当前股价状态)。
2. **`Clues` (核心):** 用于侦探墙模式。字段需包含：状态 (未回收/已回收), 埋线章节, 回收章节, 重要性评级。
3. **`Characters`:** 角色档案。
4. **`Chapters`:** 作为时间轴的锚点。
5. **`Extras`:** 独立的短篇/随笔（次要内容，与核心库分离）。

**UI/UX Requirements:**

1. **Visual Impact & Typography:** 采用 **Editorial Design**（杂志排版风格），使用衬线字体（Serif），强调留白。
2. **Visualization Components (MDX):**

   - `<EmotionChart />`: 基于章节的情感波动折线图。
   - `<ClueTracker />`: 交互式伏笔回收清单。
   - `<ChatExcerpt />`: 模仿 IM 软件的对话气泡组件。
   - `<Spoiler />`: 防剧透折叠块。
   - `<QuoteCard />`: **金句卡片**（高亮名台词）。
   - **Reading Page:** 阅读页 `moments/[slug]` 支持**动态主题**。比如这篇文是关于“攻 A”的，页面就会自动变成他的代表色（如靛蓝色）。
   - **`<AttributeRadar />`:** **属性雷达图**。适配深色模式，线条会做成发光的样式。
   - **`<StockTickerItem />`:** **股市行情卡**。不仅有数字，还要有 **Sparkline**（迷你走势折线图）和涨跌箭头。

   **对话气泡 (`ChatBubble`)：** 修复左右对齐逻辑（右侧为发送方，左侧为接收方）。优化配色（接收方灰色系）和圆角样式，并增加头像支持。

   **防剧透 (`SpoilerText`)：** 实现背景模糊遮罩，并修复点击/悬停后的“揭示”交互效果，确保在 MDX 中可用。
3. **Advanced Tagging:** 实现类似 AO3 的**分面标签系统 (Scoped Tags)**，例如 `trope:先婚后爱`, `vibe:酸涩`, `status:热恋中`，并在前端通过不同颜色胶囊展示。
4. **Interactive Relationship Graph:** 中心是主角，周围是攻，连线粗细代表情感浓度，连线颜色代表关系性质（纯爱/扭曲/利用）。
5. **Trope Tags:** 实现胶囊标签，支持如 `tag:黑化`, `tag:火葬场`, `tag:囚禁` 等特殊样式。
6. 高级排版。主页不要是从上到下的流水账

### 特化组件设计 (MDX Components)

### 几个特定的可视化组件：

#### A. `<StockChart />` (买股走势图)

这是一个**多折线图**。

- X 轴：时间/章节。
- Y 轴：好感度/羁绊值。
- 线条：每一条线代表一个攻（用他的代表色）。
- **效果：** 你可以直观看到谁在第 10 章“掉分”了，谁在第 20 章“异军突起”成为黑马。

#### B. `<RadarCompare />` (六边形战士对比)

在主页放一个雷达图，对比不同攻的属性：

### 极客关键词 (用于搜索/打标签)

如果您需要在 GitHub 找轮子，或在 Pinterest 找设计参考，请使用这些关键词组合：

**架构与技术 (Tech & Arch):**

> ```
> Astro SSG` `Content Collections` `Zod Schema` `React Data Viz` `Tailwind Typography` `MDX Components` `Obsidian to Astro` `Knowledge Graph
> ```

**功能特性 (Features):**

> ```
> Character Relationship Map` `Foreshadowing Tracker` `Timeline Visualization` `Scoped Tagging System` `Interactive Fiction` `Wiki Structure
> ```

**设计风格 (Aesthetic):**

> ```
> Editorial Web Design` `Swiss Style` `Serif Typography` `Minimalist Dashboard` `Visual Storytelling` `Dark Mode
> ```

### 给你的开发锦囊 (Cheatsheet)

在开发过程中，时刻回想这三个核心原则：

1. **Relation First (关系优先):** 不要写死内容。通过 `reference()` 建立连接。比如在写“伏笔”时，直接引用“章节 ID”，这样点击章节就能自动列出该章节下的所有伏笔。
2. **Component Driven (组件驱动):** 遇到需要重复展现的格式（比如“名台词解析”），不要用 Markdown 的引用块，直接写一个 `<QuoteAnalysis />` 组件。
3. **Tags are Data (标签即数据):** 不要只把 Tag 当作分类。Tag 是你的过滤器。

在角色档案功能，角色有头像（你占位即可，我会添加具体图片资源），点进具体角色页面后，右侧应该有角色立绘，网站首页有图片轮播功能，图片半透明，去掉六边形对比，细化关系界面，不关心具体数值，点进去，能看到俩人关系中重要元素道具信物，相关剧情及配图
关系中崔要员 × 金率音代表颜色颜色是蓝红，布朗 × 金率音是粉金
进一步丰富优化ui效果，交互效果
