"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Demo preview with code toggle ─── */
function DemoPreview({ url, title, iframeWidth, iframeHeight }: { url: string; title: string; iframeWidth?: number; iframeHeight?: number }) {
  const [mode, setMode] = useState<"demo" | "code">("demo");
  const [code, setCode] = useState<string>("");

  const w = iframeWidth ?? 428;
  const h = iframeHeight ?? 926;
  const isWide = !!iframeWidth;

  useEffect(() => {
    if (mode === "code" && !code) {
      fetch(url)
        .then((r) => r.text())
        .then(setCode)
        .catch(() => setCode("// Failed to load source"));
    }
  }, [mode, code, url]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ececf1] shadow-[0_20px_50px_-28px_rgba(21,24,34,0.18)]">
      <div className="flex items-center justify-between border-b border-[#f0f1f4] bg-[#fafafc] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-[#e4e7ec] bg-white p-0.5 text-[0.82rem] font-medium">
          <button
            type="button"
            onClick={() => setMode("demo")}
            className={`rounded-md px-3 py-1 transition ${mode === "demo" ? "bg-[#111318] text-white" : "text-[#7a808c] hover:bg-[#f3f4f6]"}`}
          >
            Demo
          </button>
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`rounded-md px-3 py-1 transition ${mode === "code" ? "bg-[#111318] text-white" : "text-[#7a808c] hover:bg-[#f3f4f6]"}`}
          >
            Code
          </button>
        </div>
      </div>
      {mode === "demo" ? (
        isWide ? (
          <div className="overflow-auto bg-white" style={{ maxHeight: h + 40 }}>
            <iframe
              src={url}
              title={title}
              className="block border-0"
              style={{ width: w, height: h, minWidth: w }}
            />
          </div>
        ) : (
          <iframe
            src={url}
            title={title}
            className="mx-auto block max-w-full border-0 bg-white"
            width={w}
            height={h}
          />
        )
      ) : (
        <pre className="max-h-[926px] overflow-auto bg-[#1e1e2e] p-6 text-[0.82rem] leading-[1.6]">
          <code className="text-[#cdd6f4]">{code || "Loading..."}</code>
        </pre>
      )}
    </div>
  );
}

/* ─── Nav items (same as home) ─── */
const navItems = [
  { label: "Home", href: "/" },
  { label: "Cases", href: "/cases" },
  { label: "Assets", href: "/assets" },
  { label: "Skills", href: "/skills" },
  { label: "Cheatsheet", href: "/cheatsheet" },
];
const navItemsZh = [
  { label: "首页", href: "/" },
  { label: "实战案例", href: "/cases" },
  { label: "资产库", href: "/assets" },
  { label: "skill 库", href: "/skills" },
  { label: "Cheatsheet", href: "/cheatsheet" },
];

/* ─── Case data ─── */
type CaseItem = {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  steps: { prompt: string; promptEn: string; desc: string; descEn: string }[];
  beforeLabel: string;
  beforeLabelEn: string;
  afterLabel: string;
  afterLabelEn: string;
  specLink?: string;
  specLabel?: string;
  specLabelEn?: string;
  video?: string;
  demoUrl?: string;
  iframeWidth?: number;
  iframeHeight?: number;
  beforeUrl?: string;
  afterUrl?: string;
  tripleUrls?: [string, string, string];
  tripleLabels?: [string, string, string];
  tripleLabelsEn?: [string, string, string];
};

const cases: CaseItem[] = [
  {
    id: "settings",
    title: "设置",
    titleEn: "Settings",
    desc: "通过 QQ GenUI 生成移动端设置页界面，根据需求添加设置组件，组件自带完整交互逻辑。",
    descEn: "Generate a mobile settings page with QQ GenUI. Add setting components as needed — each comes with complete interaction logic.",
    video: "/videos/settings-demo.mp4",
    demoUrl: "/demos/setting-standalone.html",
    steps: [
      { prompt: "参考这个页面的内容（可使用截图或直接生成），生成一个移动端设置页，命名为 setting.html", promptEn: "Based on this page's content (using screenshots or generating directly), create a mobile settings page named setting.html", desc: "Agent 自动调用 skill → 确定界面中使用哪些组件 → 读取组件库规范开始生成 → 自动检查还原问题", descEn: "Agent auto-invokes skill → determines which components to use → reads component library spec to generate → auto-checks rendering issues" },
      { prompt: "在单群管理增加一个设置项分组，叫\u201cAI管理\u201d，包含父子级功能，群AI管理开关打开来以后下方展开四个子级：修改Agent资料，读取频率，聊天记录范围，聊天记录时间周期。点击修改Agent资料以后，进入Agent资料设置页，可以在设置页输入Agent的昵称，描述、人设提示词。在agent资料设置，导航栏右侧需要有一个确认按钮，用来保存用户修改的内容。点击确认保存修改并返回上一页，返修改完资料回上一页后，群AI管理的开关要记录开关状态，修改完设置点击确认后，修改Agent资料入口要变成已设置状态", promptEn: "Add a setting group called 'AI Management' in group management with parent-child functionality. When the AI management toggle is on, expand four sub-items: Edit Agent Profile, Read Frequency, Chat History Range, Chat History Period. Tapping Edit Agent Profile enters the profile settings page with nickname, description, and persona prompt inputs. Add a confirm button in the nav bar to save changes and return to the previous page with toggle state preserved.", desc: "Agent 自动调用 skill → 确定要使用的组件 → 根据规范实现父子级 → 根据规范实现界面跳转和输入框", descEn: "Agent auto-invokes skill → determines components → implements parent-child hierarchy per spec → implements navigation and input fields per spec" },
      { prompt: "资料设置页的输入框需要支持完整交互", promptEn: "The input fields on the profile settings page need to support complete interactions", desc: "Agent 自动调用 skill → 查询输入框完整交互逻辑 → 实现完整交互", descEn: "Agent auto-invokes skill → queries full input interaction logic → implements complete interactions" },
    ],
    beforeLabel: "无规范的设置页",
    beforeLabelEn: "Settings without spec",
    afterLabel: "符合规范的设置页",
    afterLabelEn: "Spec-compliant settings",
    specLink: "/assets",
    specLabel: "查看设置组件规范",
    specLabelEn: "View settings component spec",
  },
  {
    id: "halfscreen",
    title: "半屏",
    titleEn: "Half-screen",
    desc: "根据截图等资料，检查现有设计是否符合半屏组件规范。设计师可借助 QQ GenUI 获取精准且可直接使用的组件建议并进行修正。",
    descEn: "Check whether existing designs meet the half-screen component spec. Designers can leverage QQ GenUI for precise, ready-to-use component recommendations and corrections.",
    steps: [
      { prompt: "评估这个截图是否符合半屏规范", promptEn: "Evaluate whether this screenshot meets the half-screen spec", desc: "上传截图进行规范检查", descEn: "Upload screenshot for spec check" },
      { prompt: "列出不符合规范的问题", promptEn: "List non-compliant issues", desc: "获取详细问题清单", descEn: "Get detailed issue list" },
      { prompt: "根据规范修正这些问题", promptEn: "Fix these issues according to spec", desc: "自动修正并生成合规设计", descEn: "Auto-fix and generate compliant design" },
    ],
    beforeLabel: "不符合规范的半屏",
    beforeLabelEn: "Non-compliant half-screen",
    afterLabel: "修正后的半屏",
    afterLabelEn: "Corrected half-screen",
    specLink: "/assets",
    specLabel: "查看半屏组件规范",
    specLabelEn: "View half-screen component spec",
  },
  {
    id: "demo-convert",
    title: "Demo 转化",
    titleEn: "Demo Conversion",
    desc: "使用 HTML 文件，通过组件库重新生成符合规范的界面，保留原有 demo 内容。",
    descEn: "Regenerate spec-compliant interfaces from HTML files using the component library, preserving original demo content.",
    video: "/videos/demo-convert.mp4",
    beforeUrl: "/demos/group-finding-original.html",
    afterUrl: "/demos/group-finding-standalone.html",
    steps: [
      { prompt: "使用这个 HTML 文件，通过组件库重新生成符合规范的html，要求完整保留源文件的内容和交互流程", promptEn: "Regenerate spec-compliant HTML from this file using the component library, fully preserving the source content and interaction flow", desc: "Agent 分析原始 demo 的组成模块 → 确定需要替换的组件 → 重新生成 demo", descEn: "Agent analyzes original demo modules → determines components to replace → regenerates demo" },
      { prompt: "卡片内的标签使用符合规范吗", promptEn: "Are the tags inside the cards spec-compliant?", desc: "Agent 对比组件规范与实际界面 → 自动修改为正确版本", descEn: "Agent compares component spec with actual interface → auto-corrects to the right version" },
    ],
    beforeLabel: "原始 HTML Demo",
    beforeLabelEn: "Original HTML Demo",
    afterLabel: "规范化界面",
    afterLabelEn: "Spec-compliant interface",
  },
  {
    id: "batch-produce",
    title: "批量生产界面",
    titleEn: "Batch Production",
    desc: "通过 QQ GenUI 一次生成应用的多个关键界面或流程界面。",
    descEn: "Generate multiple key screens or flow screens for an application in one go with QQ GenUI.",
    video: "/videos/batch-produce.mp4",
    demoUrl: "/demos/social-app-standalone.html",
    iframeWidth: 2320,
    iframeHeight: 1020,
    steps: [
      { prompt: "我要做一个陌生人兴趣社交应用，生成应用的5个关键页面，分别是聊天列表，聊天界面，发现，好友列表，我的账户。目标用户是20岁以下的年轻群体。把生成的界面横向平铺展示。", promptEn: "I want to build a stranger interest-based social app. Generate 5 key pages: chat list, chat screen, discover, friend list, and my account. Target users are young people under 20. Display the generated screens side by side horizontally.", desc: "Agent 规划页面内容 → 选取组件 → 查找对应组件规范 → 批量生成界面", descEn: "Agent plans page content → selects components → looks up component specs → batch generates screens" },
      { prompt: "检查生成的界面是否符合组件规范", promptEn: "Check whether the generated screens comply with component specs", desc: "Agent 对比实际界面与组件规范 → 获取差异 → 自动修复", descEn: "Agent compares actual screens with component specs → identifies differences → auto-fixes" },
    ],
    beforeLabel: "单一界面",
    beforeLabelEn: "Single screen",
    afterLabel: "完整流程界面",
    afterLabelEn: "Complete flow screens",
  },
  {
    id: "style-eval",
    title: "风格测评",
    titleEn: "Style Evaluation",
    desc: "1. 通过代入不同的 design token 整体切换风格；2. 逐项调整，调整某个 token 的值对比前后效果。",
    descEn: "1. Switch styles globally by applying different design tokens; 2. Fine-tune individual token values and compare before/after effects.",
    video: "/videos/style-eval.mp4",
    tripleUrls: ["/demos/setting-standalone.html", "/demos/setting-claude-standalone.html", "/demos/setting-notion-standalone.html"],
    tripleLabels: ["原始风格", "Claude 风格", "Notion 风格"],
    tripleLabelsEn: ["Original", "Claude Style", "Notion Style"],
    steps: [
      { prompt: "切换这个界面的风格为Claude", promptEn: "Switch this interface's style to Claude", desc: "Agent 读取当前界面使用的 token → 读取 Claude 风格的 design.md → 创建 token 映射 → 替换 token 值", descEn: "Agent reads current tokens → reads Claude design.md → creates token mapping → replaces token values" },
      { prompt: "再切换这个界面的风格为Notion", promptEn: "Now switch this interface's style to Notion", desc: "Agent 读取 Notion 风格的 design.md → 创建 token 映射 → 替换 token 值", descEn: "Agent reads Notion design.md → creates token mapping → replaces token values" },
    ],
    beforeLabel: "原始风格",
    beforeLabelEn: "Original style",
    afterLabel: "切换后风格",
    afterLabelEn: "Switched style",
  },
];

/* ─── Small before/after compare for cases ─── */
function CaseCompare({ beforeLabel, afterLabel }: { beforeLabel: string; afterLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);

  const handleMove = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    setSplit(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  const skew = 14;
  const topPct = split + skew / 2;
  const botPct = split - skew / 2;

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => { if (e.touches[0]) handleMove(e.touches[0].clientX); }}
      className="relative cursor-col-resize select-none overflow-hidden rounded-[14px] border border-[#ececf1] bg-[#fafbfc]"
      style={{ minHeight: 320 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(#edf6ff_1px,transparent_1px),linear-gradient(90deg,#edf6ff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* before layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] rounded-2xl border border-[#ebedf2] bg-white p-6 shadow-[0_16px_40px_-24px_rgba(31,36,48,0.2)]">
          <div className="h-4 w-[60%] rounded-full bg-[#e7ebf1]" />
          <div className="mt-3 h-3 w-[80%] rounded-full bg-[#eceff4]" />
          <div className="mt-3 h-3 w-[50%] rounded-full bg-[#f0f2f6]" />
          <div className="mt-5 flex gap-2">
            <span className="rounded-md bg-[#4450ff] px-4 py-2 text-xs text-white">Action</span>
            <span className="rounded-md bg-[#4450ff] px-4 py-2 text-xs text-white">Action</span>
          </div>
        </div>
      </div>

      {/* after layer */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center p-8"
        style={{ clipPath: `polygon(${topPct}% 0%, 100% 0%, 100% 100%, ${botPct}% 100%)` }}
      >
        <div className="w-full max-w-[400px] rounded-2xl border border-[#d7eaff] bg-[#fbfdff] p-6 shadow-[0_16px_40px_-24px_rgba(0,100,200,0.18)]">
          <div className="h-4 w-[60%] rounded-full bg-[#c8e4ff]" />
          <div className="mt-3 h-3 w-[80%] rounded-full bg-[#d8eeff]" />
          <div className="mt-3 h-3 w-[50%] rounded-full bg-[#e0f2ff]" />
          <div className="mt-5 flex gap-2">
            <span className="rounded-md bg-[#0099ff] px-4 py-2 text-xs font-medium text-white">Primary</span>
            <span className="rounded-md border border-[#cfe6ff] bg-white px-4 py-2 text-xs text-[#4f6b85]">Secondary</span>
          </div>
        </div>
      </div>

      {/* labels */}
      <span className="pointer-events-none absolute left-4 top-4 z-20 rounded-md border border-[#e0e3e8] bg-white px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-[#9197a4] transition-opacity duration-150" style={{ opacity: split > 14 ? 1 : 0 }}>
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-md bg-[#0099ff] px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-white transition-opacity duration-150" style={{ opacity: split < 86 ? 1 : 0 }}>
        {afterLabel}
      </span>

      {/* divider */}
      <svg className="pointer-events-none absolute inset-0 z-30" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <line x1={`${topPct}%`} y1="0%" x2={`${botPct}%`} y2="100%" stroke="#0099ff" strokeWidth="3" />
      </svg>
    </div>
  );
}

/* ─── Iframe-based before/after compare ─── */
function IframeCompare({
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
}: {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSplit(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => { e.preventDefault(); handleMove(e.clientX); };
    const onTouchMove = (e: TouchEvent) => { if (e.touches[0]) handleMove(e.touches[0].clientX); };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, handleMove]);

  const skew = 14;
  const topPct = split + skew / 2;
  const botPct = split - skew / 2;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-[#ececf1] bg-[#fafbfc]"
      style={{ height: 926 }}
    >
      {/* Before layer — full width */}
      <div className="absolute inset-0 z-0 flex justify-center">
        <iframe src={beforeUrl} title="Before" className="h-full border-0 bg-white" width="428" height="926" />
      </div>

      {/* After layer — clipped */}
      <div
        className="absolute inset-0 z-10 flex justify-center"
        style={{ clipPath: `polygon(${topPct}% 0%, 100% 0%, 100% 100%, ${botPct}% 100%)` }}
      >
        <iframe src={afterUrl} title="After" className="h-full border-0 bg-white" width="428" height="926" />
      </div>

      {/* Pointer blocker — only when dragging, prevents iframe from capturing mouse */}
      {dragging && <div className="absolute inset-0 z-20" />}

      {/* Labels */}
      <span
        className="pointer-events-none absolute left-4 top-4 z-30 rounded-md border border-[#e0e3e8] bg-white px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-[#9197a4] transition-opacity duration-150"
        style={{ opacity: split > 14 ? 1 : 0 }}
      >
        {beforeLabel}
      </span>
      <span
        className="pointer-events-none absolute right-4 top-4 z-30 rounded-md bg-[#0099ff] px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-white transition-opacity duration-150"
        style={{ opacity: split < 86 ? 1 : 0 }}
      >
        {afterLabel}
      </span>

      {/* Divider line (visual) */}
      {/* Divider line (visual) */}
      <svg className="pointer-events-none absolute inset-0 z-40" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <line x1={`${topPct}%`} y1="0%" x2={`${botPct}%`} y2="100%" stroke="#0099ff" strokeWidth="3" />
      </svg>

      {/* Draggable hit area along the divider — wide invisible strip for easy grabbing */}
      <svg
        className="absolute inset-0 z-50 pointer-events-none"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <line
          x1={`${topPct}%`} y1="0%" x2={`${botPct}%`} y2="100%"
          stroke="transparent" strokeWidth="32"
          className="pointer-events-auto cursor-col-resize"
          onMouseDown={(e) => { e.preventDefault(); setDragging(true); handleMove(e.clientX); }}
          onTouchStart={(e) => { setDragging(true); if (e.touches[0]) handleMove(e.touches[0].clientX); }}
        />
      </svg>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs tracking-[0.2em] text-[#a5a9b1]">← DRAG →</p>
    </div>
  );
}

/* ─── Triple iframe compare (two dividers, three panels) ─── */
function TripleIframeCompare({
  urls,
  labels,
}: {
  urls: [string, string, string];
  labels: [string, string, string];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split1, setSplit1] = useState(33.3);
  const [split2, setSplit2] = useState(66.6);
  const [dragging, setDragging] = useState<0 | 1 | 2>(0); // 0=none, 1=left divider, 2=right divider

  const pctFromX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return 50;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const pct = pctFromX(e.clientX);
      if (dragging === 1) setSplit1(Math.min(pct, split2 - 5));
      else setSplit2(Math.max(pct, split1 + 5));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const pct = pctFromX(e.touches[0].clientX);
      if (dragging === 1) setSplit1(Math.min(pct, split2 - 5));
      else setSplit2(Math.max(pct, split1 + 5));
    };
    const onUp = () => setDragging(0);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, pctFromX, split1, split2]);

  const skew = 14;
  const top1 = split1 + skew / 2;
  const bot1 = split1 - skew / 2;
  const top2 = split2 + skew / 2;
  const bot2 = split2 - skew / 2;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-[#ececf1] bg-[#fafbfc]"
      style={{ height: 926 }}
    >
      {/* Layer 1 (left) — full background */}
      <div className="absolute inset-0 z-0 flex justify-center">
        <iframe src={urls[0]} title={labels[0]} className="h-full border-0 bg-white" width="428" height="926" />
      </div>

      {/* Layer 2 (middle) — clipped between split1 and split2 */}
      <div
        className="absolute inset-0 z-10 flex justify-center"
        style={{ clipPath: `polygon(${top1}% 0%, ${top2}% 0%, ${bot2}% 100%, ${bot1}% 100%)` }}
      >
        <iframe src={urls[1]} title={labels[1]} className="h-full border-0 bg-white" width="428" height="926" />
      </div>

      {/* Layer 3 (right) — clipped from split2 to right */}
      <div
        className="absolute inset-0 z-20 flex justify-center"
        style={{ clipPath: `polygon(${top2}% 0%, 100% 0%, 100% 100%, ${bot2}% 100%)` }}
      >
        <iframe src={urls[2]} title={labels[2]} className="h-full border-0 bg-white" width="428" height="926" />
      </div>

      {/* Pointer blocker when dragging */}
      {dragging > 0 && <div className="absolute inset-0 z-30" />}

      {/* Labels */}
      <span
        className="pointer-events-none absolute left-4 top-4 z-40 rounded-md border border-[#e0e3e8] bg-white px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-[#9197a4] transition-opacity duration-150"
        style={{ opacity: split1 > 14 ? 1 : 0 }}
      >
        {labels[0]}
      </span>
      <span
        className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded-md border border-[#c8d8f0] bg-[#f0f6ff] px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-[#5b7ba6] transition-opacity duration-150"
        style={{ opacity: split2 - split1 > 12 ? 1 : 0 }}
      >
        {labels[1]}
      </span>
      <span
        className="pointer-events-none absolute right-4 top-4 z-40 rounded-md bg-[#0099ff] px-3 py-1 text-[0.78rem] font-semibold tracking-[0.08em] text-white transition-opacity duration-150"
        style={{ opacity: split2 < 86 ? 1 : 0 }}
      >
        {labels[2]}
      </span>

      {/* Divider lines (visual) */}
      <svg className="pointer-events-none absolute inset-0 z-50" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <line x1={`${top1}%`} y1="0%" x2={`${bot1}%`} y2="100%" stroke="#0099ff" strokeWidth="3" />
        <line x1={`${top2}%`} y1="0%" x2={`${bot2}%`} y2="100%" stroke="#0099ff" strokeWidth="3" />
      </svg>

      {/* Draggable hit areas */}
      <svg className="pointer-events-none absolute inset-0 z-[60]" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <line
          x1={`${top1}%`} y1="0%" x2={`${bot1}%`} y2="100%"
          stroke="transparent" strokeWidth="32"
          className="pointer-events-auto cursor-col-resize"
          onMouseDown={(e) => { e.preventDefault(); setDragging(1); }}
          onTouchStart={() => setDragging(1)}
        />
        <line
          x1={`${top2}%`} y1="0%" x2={`${bot2}%`} y2="100%"
          stroke="transparent" strokeWidth="32"
          className="pointer-events-auto cursor-col-resize"
          onMouseDown={(e) => { e.preventDefault(); setDragging(2); }}
          onTouchStart={() => setDragging(2)}
        />
      </svg>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs tracking-[0.2em] text-[#a5a9b1]">← DRAG →</p>
    </div>
  );
}

/* ─── Cases Page ─── */
export function CasesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLangState] = useState<"en" | "zh">(() => (searchParams.get("lang") === "en" ? "en" : "zh"));
  const isZh = lang === "zh";
  const localizedNav = isZh ? navItemsZh : navItems;

  const setLang = (l: "en" | "zh") => {
    setLangState(l);
    const params = new URLSearchParams(window.location.search);
    if (l === "en") params.set("lang", "en"); else params.delete("lang");
    const qs = params.toString();
    router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set(cases.map((c) => c.id)));
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [mobileNav, setMobileNav] = useState(false);

  const toggleCase = (id: string) => {
    setExpandedCases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setExpandedSteps((s) => { const ns = new Set(s); ns.delete(id); return ns; });
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSteps = (id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(255,255,255,0.94)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center justify-between px-4 sm:h-18 sm:px-7 lg:px-10">
          <Link href={isZh ? "/" : "/?lang=en"} className="font-serif text-[clamp(1.5rem,2.4vw,3rem)] italic leading-none tracking-[-0.02em] text-[#0f1012]">
            QQ{"\u00a0"}GenUI
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {localizedNav.map((item, idx) => (
              <Link key={item.label} href={`${item.href}${!isZh ? "?lang=en" : ""}`}>
                <span className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${idx === 1 ? "bg-[#f0f1f4] text-[#181a1e]" : "text-[#2a2d33] hover:bg-[#f3f4f6]"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center rounded-full border border-[#e2e5ea] bg-white p-0.5 text-[12px] font-medium text-[#6e7480]">
              <button type="button" onClick={() => setLang("en")} className={`inline-flex size-8 items-center justify-center rounded-full leading-none transition sm:size-9 ${!isZh ? "bg-[#111318] text-white" : "text-[#6e7480] hover:bg-[#f4f6f9]"}`}>E</button>
              <button type="button" onClick={() => setLang("zh")} className={`inline-flex size-8 items-center justify-center rounded-full leading-none transition sm:size-9 ${isZh ? "bg-[#111318] text-white" : "text-[#6e7480] hover:bg-[#f4f6f9]"}`}>中</button>
            </div>
            <button type="button" className="hidden rounded-full border border-[#14161b] bg-[#111318] px-5 py-2.5 text-sm font-semibold text-[#f8f9fb] transition hover:bg-[#0b0d12] sm:inline-flex">
              {isZh ? "登录" : "Sign In"}
            </button>
            <button type="button" aria-label="Menu" onClick={() => setMobileNav(v => !v)} className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-[#f3f4f6] md:hidden">
              <div className="flex w-5 flex-col gap-[5px]">
                <span className={`h-[2px] w-full rounded-full bg-[#1a1d24] transition-transform duration-200 ${mobileNav ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-[2px] w-full rounded-full bg-[#1a1d24] transition-opacity duration-200 ${mobileNav ? "opacity-0" : ""}`} />
                <span className={`h-[2px] w-full rounded-full bg-[#1a1d24] transition-transform duration-200 ${mobileNav ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileNav && (
            <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-t border-[var(--border)] bg-white md:hidden">
              <div className="space-y-1 px-4 py-4">
                {localizedNav.map((item) => (
                  <Link key={item.label} href={`${item.href}${!isZh ? "?lang=en" : ""}`} onClick={() => setMobileNav(false)} className="block rounded-xl px-4 py-3 text-[1rem] font-medium text-[#2a2d33] transition hover:bg-[#f3f4f6]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto w-full max-w-[1360px] px-4 pb-20 pt-10 sm:px-7 sm:pt-14 lg:px-10">
        <p className="text-[15px] leading-none tracking-[0.012em] text-[#949aa4]">{isZh ? "实战案例" : "Cases"}</p>
        <h1 className="mt-6 font-serif text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.96] tracking-[-0.025em] text-[#0b0d13]">
          {isZh ? "真实场景，真实效果" : "Real scenarios, real results"}
        </h1>
        <p className="mt-5 max-w-[680px] text-[clamp(1.04rem,1.35vw,1.22rem)] leading-[1.72] text-[#505764]">
          {isZh
            ? "通过真实场景了解 QQ GenUI 的能力。每个案例包含完整的操作步骤、生成效果对比和手机端体验入口。"
            : "Explore QQ GenUI capabilities through real-world scenarios. Each case includes step-by-step instructions, before/after comparisons, and mobile preview access."}
        </p>

        {/* ── Collapse/Expand all ── */}
        <div className="mt-10 flex gap-3">
          <button type="button" onClick={() => setExpandedCases(new Set(cases.map((c) => c.id)))} className="rounded-full border border-[#e2e5ea] bg-white px-5 py-2 text-[0.88rem] font-medium text-[#505764] transition hover:bg-[#f7f8fa]">
            {isZh ? "全部展开" : "Expand all"}
          </button>
          <button type="button" onClick={() => setExpandedCases(new Set())} className="rounded-full border border-[#e2e5ea] bg-white px-5 py-2 text-[0.88rem] font-medium text-[#505764] transition hover:bg-[#f7f8fa]">
            {isZh ? "全部折叠" : "Collapse all"}
          </button>
        </div>

        {/* ── Case list ── */}
        <div className="mt-14 border-y border-[rgba(16,20,30,.08)]">
          {cases.map((c, caseIdx) => {
            const isOpen = expandedCases.has(c.id);
            const stepsOpen = expandedSteps.has(c.id);

            return (
              <article key={c.id} className="border-b border-[rgba(16,20,30,.08)] last:border-b-0">
                {/* Case header */}
                <button
                  type="button"
                  className="flex min-h-[5.5rem] w-full items-center justify-between gap-6 py-8 text-left"
                  onClick={() => toggleCase(c.id)}
                >
                  <div className="flex items-baseline gap-5">
                    <span className="text-[0.88rem] tabular-nums text-[#b4b8c2]">{String(caseIdx + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15] tracking-[-0.015em] text-[#1a1d24]">
                      {isZh ? c.title : c.titleEn}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 0.94 : 1 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 text-[1.9rem] leading-none text-[#0099ff]"
                  >
                    +
                  </motion.span>
                </button>

                {/* Case body — collapsible */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="case-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.36, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.24 } }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-10 pb-12">
                        {/* Description */}
                        <p className="max-w-[860px] text-[1.06rem] leading-[1.82] text-[#505764]">
                          {isZh ? c.desc : c.descEn}
                        </p>

                        {/* Video */}
                        {c.video ? (
                          <video
                            src={c.video}
                            controls
                            playsInline
                            className="w-full rounded-2xl border border-[#ececf1] shadow-[0_20px_50px_-28px_rgba(21,24,34,0.18)]"
                          />
                        ) : (
                          <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-[#cdd2da] bg-[#fafbfc]">
                            <div className="text-center">
                              <span className="text-[2.5rem] leading-none text-[#c4c9d2]">▶</span>
                              <p className="mt-2 text-[0.92rem] text-[#9ea3ac]">{isZh ? "案例录屏视频（占位）" : "Case walkthrough video (placeholder)"}</p>
                            </div>
                          </div>
                        )}

                        {/* Steps — collapsible */}
                        <div className="rounded-2xl border border-[#ececf1] bg-[#fcfcfd]">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-2xl px-6 py-5 text-left transition hover:bg-[#f7f8fa]"
                            onClick={() => toggleSteps(c.id)}
                          >
                            <span className="text-[1.05rem] font-semibold text-[#1a1d24]">
                              {isZh ? `操作步骤（${c.steps.length} 步）` : `Steps (${c.steps.length})`}
                            </span>
                            <motion.span
                              animate={{ rotate: stepsOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-[0.92rem] text-[#7f8591]"
                            >
                              ▼
                            </motion.span>
                          </button>

                          <AnimatePresence initial={false} mode="wait">
                            {stepsOpen && (
                              <motion.div
                                key={`steps-${c.id}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                                className="overflow-hidden"
                              >
                                <ol className="space-y-1 border-t border-[#ececf1] px-6 pb-6 pt-5">
                                  {c.steps.map((step, i) => (
                                    <li key={i} className="flex gap-4 rounded-xl px-1 py-4">
                                      <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf6ff] text-[0.85rem] font-semibold text-[#0099ff]">
                                        {i + 1}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="rounded-xl border border-[#e4e7ec] bg-[#f8f9fb] px-5 py-4 text-[0.95rem] leading-[1.75] text-[#2d3340]">
                                          <span className="mr-1.5 font-serif text-[1.6rem] leading-none text-[#0077cc]">&ldquo;</span>
                                          {isZh ? step.prompt : step.promptEn}
                                          <span className="ml-1 font-serif text-[1.6rem] leading-none text-[#0077cc]">&rdquo;</span>
                                        </p>
                                        <p className="mt-2.5 flex items-center gap-2 text-[0.92rem] leading-[1.65] text-[#7f8591]">
                                          <span className="inline-block size-1.5 shrink-0 rounded-full bg-[#c4c9d2]" />
                                          {isZh ? step.desc : step.descEn}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ol>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Demo preview or Before/After compare */}
                        {c.tripleUrls ? (
                          <TripleIframeCompare
                            urls={c.tripleUrls}
                            labels={isZh ? c.tripleLabels! : c.tripleLabelsEn!}
                          />
                        ) : c.beforeUrl && c.afterUrl ? (
                          <IframeCompare
                            beforeUrl={c.beforeUrl}
                            afterUrl={c.afterUrl}
                            beforeLabel={isZh ? c.beforeLabel : c.beforeLabelEn}
                            afterLabel={isZh ? c.afterLabel : c.afterLabelEn}
                          />
                        ) : c.demoUrl ? (
                          <DemoPreview url={c.demoUrl} title={isZh ? c.title : c.titleEn} iframeWidth={c.iframeWidth} iframeHeight={c.iframeHeight} />
                        ) : (
                          <CaseCompare
                            beforeLabel={isZh ? c.beforeLabel : c.beforeLabelEn}
                            afterLabel={isZh ? c.afterLabel : c.afterLabelEn}
                          />
                        )}

                        {/* QR + Spec link — same level as compare */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-6">
                          <div className="flex w-full items-center gap-4 rounded-2xl border border-[#ececf1] bg-[#fcfcfd] px-5 py-4 sm:w-[280px]">
                            <div className="flex size-[72px] shrink-0 items-center justify-center rounded-xl border border-[#e4e7ec] bg-white">
                              <span className="text-[0.68rem] text-[#b4b8be]">QR Code</span>
                            </div>
                            <p className="text-[0.88rem] leading-[1.5] text-[#7f8591]">
                              {isZh ? "扫码在手机上体验" : "Scan to preview on mobile"}
                            </p>
                          </div>

                          {c.specLink && (
                            <Link
                              href={c.specLink}
                              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#ececf1] bg-[#fcfcfd] px-5 py-4 transition hover:border-[#0099ff] hover:bg-[#f6fbff] sm:w-[280px]"
                            >
                              <div>
                                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#96a0ae]">{isZh ? "相关规范" : "Related Spec"}</p>
                                <p className="mt-1 text-[0.95rem] font-semibold text-[#1a1d24]">{isZh ? c.specLabel : c.specLabelEn}</p>
                              </div>
                              <span className="text-[1.1rem] text-[#0099ff]">→</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(16,20,30,.08)] py-12">
        <p className="text-center text-[0.88rem] text-[#9ea3ac]">© 2026 QQ GenUI</p>
      </footer>
    </div>
  );
}
