export type CommandCard = {
  title: string;
  summary: string;
  tag: string;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  notes: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type CheatsheetGroup = {
  id: string;
  label: string;
  items: {
    cmd: string;
    detail: string;
    output: string;
  }[];
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Cases", href: "/cases" },
  { label: "Skills", href: "/skills" },
  { label: "Cheatsheet", href: "/cheatsheet" },
];

export const commandCards: CommandCard[] = [
  { title: "Avoid vague asks", summary: "提出明确目标、上下文与限制条件，减少偏差。", tag: "Prompting" },
  { title: "State constraints", summary: "先声明技术栈、时限、边界与不可变项。", tag: "Prompting" },
  { title: "Give examples", summary: "通过正反样例让模型更快对齐风格。", tag: "Prompting" },
  { title: "Use acceptance criteria", summary: "把可验收标准写在需求里，降低反复沟通成本。", tag: "Quality" },
  { title: "Chunk complex tasks", summary: "复杂任务拆成阶段，逐步验证再推进。", tag: "Workflow" },
  { title: "Ask for trade-offs", summary: "要求列出方案优劣，避免单一路径风险。", tag: "Decision" },
  { title: "Prefer reusable output", summary: "输出组件化、可配置内容，便于长期维护。", tag: "Architecture" },
  { title: "Capture assumptions", summary: "标注默认假设，后续变化时可快速回溯。", tag: "Workflow" },
  { title: "Request edge cases", summary: "提前覆盖空态、异常态、长文本与慢网情况。", tag: "Quality" },
  { title: "Drive by data", summary: "把文案与配置外置，避免硬编码扩散。", tag: "Architecture" },
  { title: "Measure before optimize", summary: "先定位瓶颈，再做性能优化决策。", tag: "Performance" },
  { title: "Guard accessibility", summary: "保证键盘可达、语义结构与对比度达标。", tag: "A11y" },
  { title: "Animate with purpose", summary: "动效强调状态变化，而非无意义炫技。", tag: "Motion" },
  { title: "Prefer transform/opacity", summary: "避免高频动画操作布局属性。", tag: "Motion" },
  { title: "Design for replacement", summary: "外部资源占位并标注替换点。", tag: "Delivery" },
  { title: "Version your prompts", summary: "将稳定提示词版本化，方便团队协作。", tag: "Workflow" },
  { title: "Keep output diffable", summary: "让改动可追踪、可审查、可回滚。", tag: "Engineering" },
  { title: "Separate content and layout", summary: "页面结构与内容分离，提升复用率。", tag: "Architecture" },
  { title: "Use progressive disclosure", summary: "先展示核心，再逐步揭示高级选项。", tag: "UX" },
  { title: "End with checklist", summary: "每轮交付附验收清单，确保闭环。", tag: "Delivery" },
];

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "2026-03-18",
    notes: [
      "新增命令卡分组与更清晰的视觉层级。",
      "优化首屏文案密度，提升扫描效率。",
      "更新 hover 反馈节奏，减少视觉噪声。",
    ],
  },
  {
    version: "v2.3.1",
    date: "2026-02-07",
    notes: [
      "FAQ 交互改为可键盘操作。",
      "增加 reduced-motion 降级策略。",
    ],
  },
  {
    version: "v2.2.0",
    date: "2025-12-22",
    notes: [
      "重构命令数据源为可配置结构。",
      "上线 Cheatsheet 页面与筛选能力。",
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "I'm new to QQ GenUI. Where do I start?",
    answer: "Start with the Cheatsheet page to understand each command, then try /critique first. You'll get familiar with the workflow in minutes.",
  },
  {
    question: "How do I update to the latest version?",
    answer: "Run npx skills update to get the latest version. New component specs and commands will take effect automatically.",
  },
  {
    question: "Skills aren't appearing in Codebuddy. What do I do?",
    answer: "Restart your IDE session and check workspace trust settings. If needed, reinstall and run the install command again.",
  },
  {
    question: "How do I report issues or give feedback?",
    answer: "You can submit an Issue on the project repository or provide feedback directly in the community group. We'll respond as soon as possible.",
  },
];

export const cheatsheetGroups: CheatsheetGroup[] = [
  {
    id: "prompt",
    label: "Prompt Basics",
    items: [
      {
        cmd: "Set clear objective",
        detail: "一句话写清任务结果、目标受众和边界。",
        output: "输出更聚焦，减少偏题。",
      },
      {
        cmd: "Attach context",
        detail: "补充现状、依赖、已有方案和不可改项。",
        output: "更贴近真实业务约束。",
      },
      {
        cmd: "Define done criteria",
        detail: "提前给出可验收标准和失败条件。",
        output: "交付质量更稳定。",
      },
    ],
  },
  {
    id: "ui",
    label: "UI Craft",
    items: [
      {
        cmd: "Build from sections",
        detail: "先模块后细节，逐段对齐视觉。",
        output: "页面可控、迭代快。",
      },
      {
        cmd: "Use reusable tokens",
        detail: "颜色、间距、圆角和阴影统一变量。",
        output: "一致性更高。",
      },
      {
        cmd: "Animate meaningful states",
        detail: "动效仅用于引导视线和反馈交互。",
        output: "体验更自然。",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    items: [
      {
        cmd: "Ship with placeholders",
        detail: "素材缺失时先占位，保证结构先上线。",
        output: "进度可持续推进。",
      },
      {
        cmd: "Track deltas",
        detail: "记录与目标站差异清单并持续收敛。",
        output: "还原路径可管理。",
      },
      {
        cmd: "Validate responsiveness",
        detail: "移动、平板、桌面逐断点验收。",
        output: "跨端表现稳定。",
      },
    ],
  },
];