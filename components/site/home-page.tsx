"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { faqItems, navItems } from "@/data/site-content";
import { useCallback, useEffect, useRef, useState } from "react";

const frameworkGroups = [
  {
    title: "DIAGNOSE",
    tone: "blue",
    items: [
      { no: "1", symbol: "Cr", cmd: "/critique" },
      { no: "2", symbol: "Au", cmd: "/audit" },
    ],
  },
  {
    title: "INTERACTION",
    tone: "teal",
    items: [
      { no: "3", symbol: "Ci", cmd: "/component-interaction" },
      { no: "4", symbol: "If", cmd: "/interface-flow" },
    ],
  },
  {
    title: "RECREATE",
    tone: "green",
    items: [
      { no: "5", symbol: "Op", cmd: "/optimize" },
      { no: "6", symbol: "Ha", cmd: "/harden" },
    ],
  },
  {
    title: "STYLE",
    tone: "orange",
    items: [
      { no: "7", symbol: "Ss", cmd: "/switch-style" },
      { no: "8", symbol: "Si", cmd: "/switch-icons" },
    ],
  },
] as const;

const frameworkTone = {
  blue: { title: "text-[#2e6efe]", tile: "text-[#2f72ff] border-[#3f84ff]" },
  teal: { title: "text-[#0d9488]", tile: "text-[#0f9d90] border-[#2dd4bf]" },
  green: { title: "text-[#149651]", tile: "text-[#189e58] border-[#19c863]" },
  orange: { title: "text-[#d9861c]", tile: "text-[#de8720] border-[#ff9f1f]" },
  purple: { title: "text-[#7c5cfc]", tile: "text-[#8366ff] border-[#a18cff]" },
} as const;

const frameworkGroupsZh = [
  {
    title: "诊断",
    tone: "blue" as const,
    items: [
      { no: "1", symbol: "Cr", cmd: "/评估" },
      { no: "2", symbol: "Au", cmd: "/修正" },
    ],
  },
  {
    title: "交互流程",
    tone: "teal" as const,
    items: [
      { no: "3", symbol: "Ci", cmd: "/组件交互" },
      { no: "4", symbol: "If", cmd: "/界面流程" },
    ],
  },
  {
    title: "复刻",
    tone: "green" as const,
    items: [
      { no: "5", symbol: "Op", cmd: "/重塑" },
      { no: "6", symbol: "Ha", cmd: "/模仿" },
    ],
  },
  {
    title: "风格",
    tone: "orange" as const,
    items: [
      { no: "7", symbol: "Ss", cmd: "/切换风格" },
      { no: "8", symbol: "Si", cmd: "/切换图标库" },
    ],
  },
];

const actionGroups = [
  {
    label: "DIAGNOSE",
    items: [
      {
        cmd: "/critique",
        desc: "Check whether the current design meets the half-screen component spec based on screenshots and other materials. Designers can leverage Qdesign for precise, ready-to-use component recommendations.",
        spec: "Full half-screen spec",
      },
      {
        cmd: "/audit",
        desc: "Fix incorrect designs in mockups according to form component specifications. With Qdesign, you can correct component usage, component interactions, layout, and token usage issues.",
        spec: "Full settings spec",
      },
    ],
  },
  {
    label: "INTERACTION",
    items: [
      {
        cmd: "/component-interaction",
        desc: "Beyond surface-level display — components come with complete interaction logic, ready for demo production.",
        spec: "",
      },
      {
        cmd: "/interface-flow",
        desc: "Batch-generate multiple screens to showcase a full interaction flow, or complete a full demo within a single screen.",
        spec: "",
      },
    ],
  },
  {
    label: "QUALITY",
    items: [
      {
        cmd: "/optimize",
        desc: "Regenerate spec-compliant interfaces from third-party screenshots, Figma files, or HTML content using the component library.",
        spec: "",
      },
      {
        cmd: "/harden",
        desc: "Reorganize product interface content into a new structure by referencing third-party layouts, while maintaining spec compliance.",
        spec: "",
      },
    ],
  },
  {
    label: "STYLE",
    items: [
      {
        cmd: "/switch-style",
        desc: "Keep the interface structure and switch between different platform/brand styles to compare visual effects.",
        spec: "",
      },
      {
        cmd: "/switch-icons",
        desc: "Keep icon semantics and switch between different icon libraries to compare visual effects.",
        spec: "",
      },
    ],
  },
  {
    label: "DELIVERY",
    items: [
      {
        cmd: "/check-code",
        desc: "Review generated component code and design tokens for spec compliance. Quickly scan for errors and fix them with Qdesign.",
        spec: "",
      },
    ],
  },
];

const actionGroupsZh = [
  {
    label: "诊断",
    items: [
      {
        cmd: "/评估",
        desc: "根据截图等资料，检查现有设计是否符合半屏组件规范。设计师可借助\u00a0Qdesign\u00a0获取精准且可直接使用的组件建议。",
        spec: "完整半屏规范",
      },
      {
        cmd: "/修正",
        desc: "根据表单组件规范，修复设计稿中的错误设计。借助\u00a0Qdesign，可修正组件使用、组件交互、布局、token 使用等问题。",
        spec: "完整设置规范",
      },
    ],
  },
  {
    label: "交互流程",
    items: [
      {
        cmd: "/组件交互",
        desc: "不仅是界面表层展示，组件自带完整交互逻辑，可直接用于 demo 制作。",
        spec: "",
      },
      {
        cmd: "/界面流程",
        desc: "支持批量生成多个界面展示完整交互流程，或在单一界面中完成完整 demo 演示。",
        spec: "",
      },
    ],
  },
  {
    label: "复刻",
    items: [
      {
        cmd: "/重塑",
        desc: "使用第三方截图、Figma、HTML 的内容，通过组件库重新生成符合规范的界面。",
        spec: "",
      },
      {
        cmd: "/模仿",
        desc: "参考第三方界面的结构，在符合规范的前提下，将产品界面的内容重新组合为新的结构。",
        spec: "",
      },
    ],
  },
  {
    label: "风格",
    items: [
      {
        cmd: "/切换风格",
        desc: "保持界面结构，切换不同平台/品牌的风格，对比视觉效果。",
        spec: "",
      },
      {
        cmd: "/切换图标库",
        desc: "保持图标语义，切换不同图标库资源，对比视觉效果。",
        spec: "",
      },
    ],
  },
  {
    label: "交付",
    items: [
      {
        cmd: "/检查代码",
        desc: "查看生成的内容的组件代码和 design token 是否规范，通过\u00a0Qdesign\u00a0快速扫描错误并修复。",
        spec: "",
      },
    ],
  },
];

const navItemsZh = [
  { label: "首页", href: "/" },
  { label: "实战案例", href: "/cases" },
  { label: "资产库", href: "/assets" },
  { label: "skill 库", href: "/skills" },
  { label: "Cheatsheet", href: "/cheatsheet" },
];

const faqItemsZh = [
  {
    question: "我刚接触 Qdesign，从哪里开始？",
    answer: "先看 Cheatsheet 页面，了解各命令的用途，然后从 /评估 开始尝试，几分钟就能熟悉流程。",
  },
  {
    question: "如何更新到最新版本？",
    answer: "运行 npx skills update 即可更新到最新版本，新的组件规范和命令会自动生效。",
  },
  {
    question: "在 Codebuddy 中看不到 skills 怎么办？",
    answer: "重启 IDE 会话并检查工作区信任设置；必要时重新安装后再次执行安装命令。",
  },
  {
    question: "使用中有问题，应该如何反馈？",
    answer: "可以通过项目仓库提交 Issue，或在社区群中直接反馈，我们会尽快响应。",
  },
];

/* ─── Before / After interactive compare ─── */
function BeforeAfterCompare({ isZh }: { isZh: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);

  const handleMove = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplit(pct);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  /* ── shared mock UI card ── */
  const MockCard = ({ variant }: { variant: "before" | "after" }) => {
    const isBefore = variant === "before";
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-6 py-10">
        <div
          className={`w-full max-w-[420px] rounded-[20px] p-6 shadow-[0_20px_48px_-20px_rgba(60,60,100,0.32)] ${
            isBefore ? "border border-[#ececf2] bg-white" : "border border-[#d9ecff] bg-white"
          }`}
        >
          <div className="flex items-start gap-3.5">
            <span className={`mt-0.5 size-11 shrink-0 rounded-full ${isBefore ? "bg-[#7a5eff]" : "bg-[#0099ff]"}`} />
            <div>
              <p className="text-[1.22rem] font-semibold leading-none text-[#151a24]">
                {isBefore
                  ? (isZh ? "欢迎来到设计" : "Welcome to design")
                  : (isZh ? "QQ 设计系统" : "QQ Design System")}
              </p>
              <p className="mt-1.5 text-[0.92rem] leading-[1.42] text-[#7d8494]">
                {isBefore
                  ? (isZh ? "好的方案有其目的。避免无意义占位、泛化视觉、通用模板。" : "The best solution has purpose. Avoid lorem ipsum, vague eye, generic placeholders.")
                  : (isZh ? "Token 驱动布局，4px 网格，符合规范的组件变体与交互状态。" : "Token-driven layout, 4px grid, spec-compliant variants with interaction states.")}
              </p>
            </div>
          </div>

          <button
            className={`mt-5 w-full rounded-xl px-4 py-3 text-[1rem] font-semibold text-white ${
              isBefore ? "bg-[#7a5eff]" : "bg-[#0099ff]"
            }`}
          >
            {isBefore
              ? (isZh ? "生成" : "Generate")
              : (isZh ? "使用 Qdesign 生成" : "Generate with Qdesign")}
          </button>
        </div>

        {/* floating annotations */}
        {isBefore && (
          <>
            <span className="mt-4 self-start ml-6 inline-flex rounded-md border border-[#33b8ff] bg-white px-2 py-0.5 text-[0.78rem] font-semibold tracking-[0.02em] text-[#0099ff]">
              PURPLE GRADIENT
            </span>
            <span className="mt-2 self-start ml-6 inline-flex rounded-md border border-[#33b8ff] bg-white px-2 py-0.5 text-[0.78rem] font-semibold tracking-[0.02em] text-[#0099ff]">
              CARDS ON CARDS
            </span>
          </>
        )}
        {!isBefore && (
          <>
            <span className="mt-4 self-end mr-6 inline-flex rounded-md border border-[#b6dfff] bg-[#f0f8ff] px-2 py-0.5 text-[0.78rem] font-semibold tracking-[0.02em] text-[#0077cc]">
              4PX GRID
            </span>
            <span className="mt-2 self-end mr-6 inline-flex rounded-md border border-[#b6dfff] bg-[#f0f8ff] px-2 py-0.5 text-[0.78rem] font-semibold tracking-[0.02em] text-[#0077cc]">
              DESIGN TOKENS
            </span>
          </>
        )}
      </div>
    );
  };

  /* skew offset: the divider tilts so bottom is ~8% to the right of top */
  const skew = 14;
  const topPct = split + skew / 2;
  const botPct = split - skew / 2;

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative cursor-col-resize select-none overflow-hidden rounded-[14px] border border-[#ececf1] bg-[#fafbfc]"
      style={{ minHeight: "clamp(380px, 50vw, 520px)" }}
    >
      {/* grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(#edf6ff_1px,transparent_1px),linear-gradient(90deg,#edf6ff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* BEFORE layer — full width, always visible behind */}
      <div className="absolute inset-0 z-0">
        <MockCard variant="before" />
      </div>

      {/* AFTER layer — clipped with skewed polygon following the divider */}
      <div
        className="absolute inset-0 z-10"
        style={{
          clipPath: `polygon(${topPct}% 0%, 100% 0%, 100% 100%, ${botPct}% 100%)`,
        }}
      >
        <MockCard variant="after" />
      </div>

      {/* BEFORE label */}
      <span
        className="pointer-events-none absolute left-4 top-4 z-20 rounded-md border border-[#e0e3e8] bg-white px-3 py-1 text-[0.82rem] font-semibold tracking-[0.1em] text-[#9197a4] transition-opacity duration-150"
        style={{ opacity: split > 14 ? 1 : 0 }}
      >
        BEFORE
      </span>

      {/* AFTER label */}
      <span
        className="pointer-events-none absolute right-4 top-4 z-20 rounded-md bg-[#0099ff] px-3 py-1 text-[0.82rem] font-semibold tracking-[0.1em] text-white transition-opacity duration-150"
        style={{ opacity: split < 86 ? 1 : 0 }}
      >
        AFTER
      </span>

      {/* skewed divider line (SVG for crisp diagonal) */}
      <svg
        className="pointer-events-none absolute inset-0 z-30"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <line
          x1={`${topPct}%`}
          y1="0%"
          x2={`${botPct}%`}
          y2="100%"
          stroke="#0099ff"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

function CritiqueDemoCompare({ isZh }: { isZh: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(54);

  const handleMove = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplit(pct);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const skew = 14;
  const topPct = split + skew / 2;
  const botPct = split - skew / 2;

  const CritiqueLayer = ({ variant }: { variant: "before" | "after" }) => {
    const isBefore = variant === "before";

    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center px-4 pb-12 pt-8 sm:px-7">
          <div
            className={`w-full max-w-[720px] rounded-[18px] px-6 py-7 shadow-[0_20px_48px_-32px_rgba(31,36,48,0.22)] ${
              isBefore ? "border border-[#ebedf2] bg-white" : "border border-[#d7eaff] bg-[#fbfdff]"
            }`}
          >
            <div className="text-[0.82rem] tracking-[0.1em] text-[#8e95a2]">{isZh ? "仪表盘" : "DASHBOARD"}</div>
            <p className="mt-4 text-[clamp(1.02rem,1.5vw,1.15rem)] leading-[1.45] text-[#6f7788]">
              {isBefore
                ? (isZh ? "欢迎来到你的仪表盘，你可以在这里管理所有内容。" : "Welcome to your dashboard where you can manage things")
                : (isZh ? "清晰的信息层级、明确主操作与结构化内容区域。" : "Clear hierarchy, a single primary action, and structured content blocks.")}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {isBefore ? (
                <>
                  <span className="rounded-md bg-[#4450ff] px-4 py-2 text-[0.95rem] text-white">Create</span>
                  <span className="rounded-md bg-[#4450ff] px-4 py-2 text-[0.95rem] text-white">Import</span>
                  <span className="rounded-md bg-[#4450ff] px-4 py-2 text-[0.95rem] text-white">Export</span>
                  <span className="rounded-md bg-[#4450ff] px-4 py-2 text-[0.95rem] text-white">Settings</span>
                </>
              ) : (
                <>
                  <span className="rounded-md bg-[#0099ff] px-4 py-2 text-[0.95rem] font-medium text-white">Create project</span>
                  <span className="rounded-md border border-[#cfe6ff] bg-white px-4 py-2 text-[0.95rem] text-[#4f6b85]">Import</span>
                  <span className="rounded-md border border-[#cfe6ff] bg-white px-4 py-2 text-[0.95rem] text-[#4f6b85]">Templates</span>
                </>
              )}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className={`rounded-xl border p-4 ${isBefore ? "border-[#f0f1f4] bg-[#fbfbfd]" : "border-[#d7eaff] bg-[#f6fbff]"}`}>
                <p className="text-[0.82rem] tracking-[0.08em] text-[#96a0ae]">{isZh ? "概览" : "OVERVIEW"}</p>
                <div className="mt-3 space-y-2">
                  <div className="h-2.5 w-[72%] rounded-full bg-[#e7ebf1]" />
                  <div className="h-2.5 w-[58%] rounded-full bg-[#eceff4]" />
                  <div className="h-2.5 w-[64%] rounded-full bg-[#f0f2f6]" />
                </div>
              </div>
              <div className={`rounded-xl border p-4 ${isBefore ? "border-[#f0f1f4] bg-[#fbfbfd]" : "border-[#d7eaff] bg-[#f6fbff]"}`}>
                <p className="text-[0.82rem] tracking-[0.08em] text-[#96a0ae]">{isZh ? "活动" : "ACTIVITY"}</p>
                <div className="mt-3 space-y-2">
                  <div className={`h-10 rounded-lg ${isBefore ? "bg-[#f3f5f8]" : "bg-[#eaf5ff]"}`} />
                  <div className={`h-10 rounded-lg ${isBefore ? "bg-[#f3f5f8]" : "bg-[#eef7ff]"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBefore ? (
          <>
            <span className="pointer-events-none absolute right-[17%] top-[31%] z-20 rounded-md bg-[#f1bb49] px-3 py-1 text-[0.78rem] font-semibold text-white shadow-[0_10px_24px_-18px_rgba(241,187,73,0.9)]">
              REDUNDANT
            </span>
            <span className="pointer-events-none absolute right-[16%] top-[39%] z-20 rounded-md bg-[#ef8b3d] px-3 py-1 text-[0.78rem] font-semibold text-white shadow-[0_10px_24px_-18px_rgba(239,139,61,0.9)]">
              NO PRIMARY
            </span>
            <span className="pointer-events-none absolute right-[18%] bottom-[24%] z-20 rounded-md bg-[#ef5348] px-3 py-1 text-[0.78rem] font-semibold text-white shadow-[0_10px_24px_-18px_rgba(239,83,72,0.9)]">
              DEAD END
            </span>
          </>
        ) : (
          <>
            <span className="pointer-events-none absolute left-[11%] top-[30%] z-20 rounded-md border border-[#8ad6ff] bg-white px-3 py-1 text-[0.78rem] font-semibold text-[#0099ff] shadow-[0_12px_28px_-22px_rgba(0,153,255,0.7)]">
              PRIMARY CTA
            </span>
            <span className="pointer-events-none absolute right-[14%] top-[39%] z-20 rounded-md border border-[#8ad6ff] bg-white px-3 py-1 text-[0.78rem] font-semibold text-[#0099ff] shadow-[0_12px_28px_-22px_rgba(0,153,255,0.7)]">
              CLEAR HIERARCHY
            </span>
            <span className="pointer-events-none absolute right-[16%] bottom-[24%] z-20 rounded-md border border-[#8ad6ff] bg-white px-3 py-1 text-[0.78rem] font-semibold text-[#0099ff] shadow-[0_12px_28px_-22px_rgba(0,153,255,0.7)]">
              STRUCTURED CONTENT
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative cursor-col-resize select-none overflow-hidden rounded-xl border border-[#ececf1] bg-[#fffdfd]"
      style={{ minHeight: 430 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(#f4f4f8_1px,transparent_1px),linear-gradient(90deg,#f4f4f8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="absolute inset-0 z-0">
        <CritiqueLayer variant="before" />
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          clipPath: `polygon(${topPct}% 0%, 100% 0%, 100% 100%, ${botPct}% 100%)`,
        }}
      >
        <CritiqueLayer variant="after" />
      </div>

      <span
        className="pointer-events-none absolute left-4 top-4 z-20 rounded-md border border-[#e0e3e8] bg-white px-3 py-1 text-[0.82rem] font-semibold tracking-[0.1em] text-[#9197a4] transition-opacity duration-150"
        style={{ opacity: split > 14 ? 1 : 0 }}
      >
        BEFORE
      </span>

      <span
        className="pointer-events-none absolute right-4 top-4 z-20 rounded-md bg-[#0099ff] px-3 py-1 text-[0.82rem] font-semibold tracking-[0.1em] text-white transition-opacity duration-150"
        style={{ opacity: split < 86 ? 1 : 0 }}
      >
        AFTER
      </span>

      <svg
        className="pointer-events-none absolute inset-0 z-30"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <line
          x1={`${topPct}%`}
          y1="0%"
          x2={`${botPct}%`}
          y2="100%"
          stroke="#0099ff"
          strokeWidth="3"
        />
      </svg>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 text-xs tracking-[0.2em] text-[#a5a9b1]">← DRAG →</p>
    </div>
  );
}

export function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(-1);
  const [lang, setLangState] = useState<"en" | "zh">(() => (searchParams.get("lang") === "en" ? "en" : "zh"));
  const [copiedCommand, setCopiedCommand] = useState<"install" | "use" | null>(null);
  const [activeCommand, setActiveCommand] = useState("/critique");
  const commandListRef = useRef<HTMLDivElement>(null);

  const setLang = (l: "en" | "zh") => {
    setLangState(l);
    const params = new URLSearchParams(window.location.search);
    if (l === "en") params.set("lang", "en"); else params.delete("lang");
    const qs = params.toString();
    router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const isZh = lang === "zh";

  useEffect(() => {
    const firstCmd = (isZh ? actionGroupsZh : actionGroups)[0]?.items[0]?.cmd;
    if (firstCmd) setActiveCommand(firstCmd);
  }, [isZh]);

  useEffect(() => {
    const container = commandListRef.current;
    if (!container) return;

    const articles = container.querySelectorAll<HTMLElement>("[data-cmd]");
    if (!articles.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cmd = (entry.target as HTMLElement).dataset.cmd;
            if (cmd) setActiveCommand(cmd);
          }
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );

    articles.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isZh]);

  const localizedNavItems = isZh ? navItemsZh : navItems;
  const localizedFaqItems = isZh ? faqItemsZh : faqItems;
  const localizedActionGroups = isZh ? actionGroupsZh : actionGroups;
  const installCommand = "npx skills add qkj91927/QQ_GenUI";
  const useCommand = isZh
    ? "使用skill QQ-GenUI，生成一个XX页面，需要符合组件规范"
    : "Use skill QQ-GenUI to generate an XX page that follows component standards.";

  const handleCopyCommand = async (command: string, key: "install" | "use") => {
    const fallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      textarea.style.top = "0";
      textarea.style.left = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!ok) throw new Error("copy failed");
    };

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(command);
        } catch {
          fallbackCopy();
        }
      } else {
        fallbackCopy();
      }

      setCopiedCommand(key);
      window.setTimeout(() => {
        setCopiedCommand((current) => (current === key ? null : current));
      }, 1600);
    } catch {
      setCopiedCommand(null);
    }
  };

  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(255,255,255,0.94)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1140px] items-center justify-between px-4 sm:h-18 sm:px-7 lg:px-10">
          <span className="font-serif text-[clamp(1.5rem,2.4vw,3rem)] italic leading-none tracking-[-0.02em] text-[#0f1012]">Qdesign</span>

          <nav className="hidden items-center gap-1 md:flex">
            {localizedNavItems.map((item, idx) => {
              const isAnchor = item.href.startsWith("#");
              const hrefWithLang = isAnchor ? item.href : `${item.href}${!isZh ? "?lang=en" : ""}`;
              const node = (
                <span
                  className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${
                    idx === 0 ? "bg-[#f0f1f4] text-[#181a1e]" : "text-[#2a2d33] hover:bg-[#f3f4f6]"
                  }`}
                >
                  {item.label}
                </span>
              );

              return isAnchor ? (
                <a key={item.label} href={hrefWithLang}>
                  {node}
                </a>
              ) : (
                <Link key={item.label} href={hrefWithLang}>
                  {node}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center rounded-full border border-[#e2e5ea] bg-white p-0.5 text-[12px] font-medium text-[#6e7480]">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`inline-flex size-8 items-center justify-center rounded-full leading-none transition sm:size-9 ${!isZh ? "bg-[#111318] text-white" : "text-[#6e7480] hover:bg-[#f4f6f9]"}`}
              >
                E
              </button>
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`inline-flex size-8 items-center justify-center rounded-full leading-none transition sm:size-9 ${isZh ? "bg-[#111318] text-white" : "text-[#6e7480] hover:bg-[#f4f6f9]"}`}
              >
                中
              </button>
            </div>

            <button
              type="button"
              className="hidden rounded-full border border-[#14161b] bg-[#111318] px-5 py-2.5 text-sm font-semibold text-[#f8f9fb] transition hover:bg-[#0b0d12] sm:inline-flex"
            >
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
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-[var(--border)] bg-white md:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {localizedNavItems.map((item) => {
                  const hrefWithLang = item.href.startsWith("#") ? item.href : `${item.href}${!isZh ? "?lang=en" : ""}`;
                  return (
                    <Link key={item.label} href={hrefWithLang} onClick={() => setMobileNav(false)} className="block rounded-xl px-4 py-3 text-[1rem] font-medium text-[#2a2d33] transition hover:bg-[#f3f4f6]">
                      {item.label}
                    </Link>
                  );
                })}
                <button type="button" className="mt-2 w-full rounded-xl bg-[#111318] py-3 text-center text-[1rem] font-semibold text-white sm:hidden">
                  {isZh ? "登录" : "Sign In"}
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto w-full max-w-[1140px] px-4 pb-22 pt-8 sm:px-7 sm:pt-12 lg:px-10">
        <section className="grid min-h-[calc(100svh-72px)] items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10 lg:max-w-[600px]"
          >
            <div className="space-y-5">
              <h1 className="font-serif text-[clamp(3.2rem,6vw,5rem)] italic leading-[0.9] tracking-[-0.03em] text-[#0b0d13]">Qdesign</h1>
              <p className="max-w-[470px] font-serif text-[clamp(1.45rem,2.5vw,2.1rem)] italic leading-[1.1] text-[#141821]">
                {isZh ? "AI harnesses 提升设计质量" : "AI harnesses that elevate design quality"}
              </p>
            </div>

            <p className={`max-w-[590px] ${isZh ? "text-[clamp(0.92rem,1.05vw,1.08rem)] leading-[1.82]" : "text-[clamp(0.92rem,1.02vw,1.1rem)] leading-[1.72]"} text-[#1d232f]`}>
              {isZh
                ? <>在实际业务中，好的设计输出要求稳定生成，符合产品设计语言。你不能要求AI为你生成{"\u201c"}符合QQ规范的界面{"\u201d"}而不提供任何设计上下文和约束。Qdesign为你提供了完整的AI友好的QQ设计规范，开箱即用，对使用者的提示词水平和使用的开发工具无要求。</>
                : "In real-world product work, high-quality design output must be consistently generated and aligned with the product design language. You cannot ask AI to generate a \"QQ-compliant interface\" without providing any design context or constraints. Qdesign gives you a complete, AI-friendly QQ design specification out of the box, with no requirements on users' prompt-writing skills or development tools."}
            </p>

            <div className="max-w-[560px] border border-[#e5e8ee] bg-white px-5 py-3">
              <p className="text-[0.82rem] uppercase tracking-[0.13em] text-[#8f95a0]">{isZh ? "包括" : "What's included"}</p>
              <p className={`mt-2 ${isZh ? "text-[clamp(0.88rem,1vw,1.02rem)] leading-[1.6]" : "text-[clamp(0.88rem,0.95vw,1rem)] leading-[1.56]"} text-[#202734]`}>
                {isZh
                  ? "组件规范：20 个组件类型（导航、数据、操作、模态...）的所有组件变体（带组件交互及组合规则），designtoken，QUI图标库，强约束的工作流skill..."
                  : "Component specs: all component variants (with interactions and composition rules) across 20 component types (navigation, data, action, modal...), designtokens, QUI icon library, and workflow skills..."}
              </p>
            </div>

            <div className="flex flex-col gap-5 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#get-started"
                className="relative inline-flex h-[58px] w-full items-center justify-center overflow-hidden border border-[#242932] bg-[#0f1218] text-[1.08rem] font-semibold uppercase leading-[1.1] tracking-[0.03em] text-white transition hover:brightness-110 sm:h-[80px] sm:w-[220px] sm:text-[1.2rem]"
              >
                <span className="pointer-events-none absolute inset-0 z-0 opacity-24 [background-image:radial-gradient(circle_at_18%_24%,rgba(255,255,255,.2),transparent_42%),radial-gradient(circle_at_88%_82%,rgba(255,255,255,.12),transparent_36%)]" />
                <span className={`relative z-20 text-center text-white ${isZh ? "whitespace-nowrap" : ""}`}>{isZh ? "开始使用" : <>GET<br />STARTED</>}</span>
              </a>

              <div className="space-y-2 text-[#4d535d]">
                <p className="text-[1.1rem] text-[#7d8490]">Works with</p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {["Codebuddy", "With", "Workbuddy", "Claude Code", "Codex", "Cursor", "VS Code"].map((item) => (
                    <span key={item} className="rounded-md border border-[#dee1e7] bg-white px-2.5 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[1.15rem] leading-none text-[#8a909b]">{isZh ? "v1.3.0 - 图标绑定完善，新增半屏模态组件规则" : "v1.3.0 - Icon binding improved, new half-screen modal component rules"}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="pt-2"
          >
            <BeforeAfterCompare isZh={isZh} />

            <div className="mt-6 flex items-center justify-center gap-12 text-[0.9rem] text-[#737b8a]">
              <span className="inline-flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#d6dae0]" /> {isZh ? "通用 AI 输出" : "General AI Output"}
              </span>
              <span className="inline-flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#0099ff]" /> {isZh ? "使用 Qdesign" : "With Qdesign"}
              </span>
            </div>
          </motion.div>
        </section>

        <section id="commands" className="mt-24">
          <p className="text-[16px] leading-none tracking-[0.012em] text-[#939aa5]">01</p>
          <h2 className="mt-10 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.01] tracking-[-0.02em] text-[#11131a]">
            {isZh ? "架构体系" : "The Framework"}
          </h2>
          <p className="mt-[36px] max-w-[920px] text-[clamp(1.05rem,1.4vw,1.6rem)] leading-[1.4] text-[#1f2531]">
            {isZh
              ? "一个具备深度能力的综合 skill 集合，赋予 agent 对交互行为、视觉语言、设计原则以及实际产品需求的深刻理解。帮助 agent 挑选适当的组件、应用统一的样式，并在构建界面时始终遵循平台规范、间距体系、排版规则以及交互模式。"
              : "A comprehensive skill set with deep expertise, giving agents a profound understanding of interaction behavior, visual language, design principles, and real-world product requirements. Helps agents select appropriate components, apply consistent styles, and always follow platform specifications, spacing systems, typographic rules, and interaction patterns when building interfaces."}
          </p>

          <div className="mt-[38px] rounded-[10px] border border-[#eceef3] bg-white px-[22px] py-[26px] sm:px-[24px] sm:py-[28px]">
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {(isZh ? frameworkGroupsZh : frameworkGroups).map((group) => {
                const tone = frameworkTone[group.tone];
                return (
                  <div key={group.title}>
                    <p className={`mb-[12px] text-[1.2rem] font-semibold tracking-[0.032em] ${tone.title}`}>{group.title}</p>

                    <div className="flex flex-wrap gap-[8px]">
                      {group.items.map((item) => (
                        <article key={item.cmd} className={`h-[78px] w-[72px] rounded-[7px] border-[1.5px] bg-white px-[6px] pt-[4px] ${tone.tile}`}>
                          <p className="text-[8.5px] leading-none opacity-50">{item.no}</p>
                          <p className="mt-[4px] font-serif text-[2.04rem] leading-[0.78] tracking-[-0.014em]">{item.symbol}</p>
                          <p className="mt-[3px] text-[0.8rem] leading-none">{item.cmd}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="in-action" className="relative mt-16 grid gap-8 border-t border-[rgba(16,20,30,.08)] pt-10 xl:grid-cols-[0.9fr_1.1fr]">

          <div className="space-y-7 pb-0 xl:pb-[420px]">
            <p className="text-[16px] leading-none tracking-[0.012em] text-[#949aa4]">02</p>
            <div>
              <h2 className="mt-3 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.06] tracking-[-0.02em] text-[#121317]">
                {isZh ? "场景" : "Scenarios"}
              </h2>
              <p className="mt-4 text-[1.08rem] text-[#202532]">
                {isZh ? "不同场景下的使用方式" : "How to use in different scenarios"}
                <Link href="/cheatsheet" className="ml-2 font-semibold text-[#0099ff] hover:opacity-80">
                  {isZh ? "查看 cheatsheet →" : "View cheatsheet →"}
                </Link>
              </p>
            </div>

            <div ref={commandListRef} className="space-y-10">
              {localizedActionGroups.map((group) => (
                <div key={group.label} className="border-t border-[rgba(16,20,30,.08)] pt-6">
                  <p className="text-[1.25rem] font-serif tracking-[0.14em] text-[#0099ff]">{group.label}</p>

                  <div className="mt-6 space-y-10">
                    {group.items.map((item) => (
                      <article
                        key={item.cmd}
                        data-cmd={item.cmd}
                        className={`cursor-pointer transition-all duration-200 ${activeCommand === item.cmd ? "border-l-2 border-[#0099ff] pl-5" : "border-l-2 border-transparent pl-5 opacity-45 hover:opacity-70"}`}
                        onClick={() => setActiveCommand(item.cmd)}
                      >
                        <h3 className="font-serif text-[clamp(1.6rem,2.4vw,2.4rem)] italic leading-none tracking-[-0.02em] text-[#12151b]">{item.cmd.replace(/^\//, "")}</h3>
                        <p className="mt-3 max-w-[560px] text-[0.92rem] leading-8 text-[#404857]">{item.desc}</p>

                        {item.spec && (
                          <p className="mt-3 text-[1.02rem] text-[#4f5563]">
                            <span className="mr-1 text-[#0099ff]">→</span>
                            <span className="ml-1 inline-flex rounded-md border border-[#e4e7ec] bg-[#f2f3f5] px-2.5 py-0.5 text-[0.92rem] text-[#1f2430]">
                              {item.spec}
                            </span>
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:sticky xl:top-20 xl:self-start">
            <article className="overflow-hidden rounded-xl border border-[#ececf1] bg-white shadow-[0_28px_60px_-34px_rgba(21,24,34,0.35)]">
              <div className="flex items-center justify-between border-b border-[#f0f1f4] bg-[#fafafc] px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCommand}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5 p-6"
                >
                  <p className="text-[2rem] leading-none text-[#0099ff]"><span className="font-semibold">{activeCommand}</span></p>

                  {(activeCommand === "/critique" || activeCommand === "/评估") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Evaluate...</li>
                        <li>2. Critique...</li>
                        <li>3. Prioritize...</li>
                        <li>4. Suggest...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <CritiqueDemoCompare isZh={isZh} />
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "混乱设计 → 识别 UX 问题并修复" : "Confusing design → UX issues identified with fixes"}</p>
                    </>
                  )}

                  {(activeCommand === "/audit" || activeCommand === "/修正") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Scan accessibility...</li>
                        <li>2. Check performance...</li>
                        <li>3. Verify theming...</li>
                        <li>4. Test responsive...</li>
                        <li>5. Detect anti-patterns...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#1b202a]">{isZh ? "可访问性" : "Accessibility"}</span>
                          <span className="rounded-full bg-[#22ad48] px-2.5 py-0.5 text-xs font-semibold text-white">92</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e8ebf0]"><div className="h-full w-[92%] rounded-full bg-[#22ad48]" /></div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#1b202a]">{isZh ? "性能" : "Performance"}</span>
                          <span className="rounded-full bg-[#f1bb49] px-2.5 py-0.5 text-xs font-semibold text-white">74</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e8ebf0]"><div className="h-full w-[74%] rounded-full bg-[#f1bb49]" /></div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#1b202a]">{isZh ? "主题一致性" : "Theming"}</span>
                          <span className="rounded-full bg-[#22ad48] px-2.5 py-0.5 text-xs font-semibold text-white">88</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e8ebf0]"><div className="h-full w-[88%] rounded-full bg-[#22ad48]" /></div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#1b202a]">{isZh ? "响应式" : "Responsive"}</span>
                          <span className="rounded-full bg-[#ef5348] px-2.5 py-0.5 text-xs font-semibold text-white">58</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e8ebf0]"><div className="h-full w-[58%] rounded-full bg-[#ef5348]" /></div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#1b202a]">{isZh ? "反模式" : "Anti-patterns"}</span>
                          <span className="rounded-full bg-[#f1bb49] px-2.5 py-0.5 text-xs font-semibold text-white">71</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e8ebf0]"><div className="h-full w-[71%] rounded-full bg-[#f1bb49]" /></div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "5 维度评分 + P0-P3 严重级别" : "5 dimensions scored with P0-P3 severity"}</p>
                    </>
                  )}

                  {(activeCommand === "/component-interaction" || activeCommand === "/组件交互") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Parse component...</li>
                        <li>2. Bind interactions...</li>
                        <li>3. Generate demo...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#0099ff] text-sm font-bold text-white">tap</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "点击交互" : "Tap Interaction"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "按钮、开关、选择器响应" : "Button, toggle, selector responses"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#2e6efe] text-sm font-bold text-white">swp</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "滑动交互" : "Swipe Interaction"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "轮播、抽屉、下拉刷新" : "Carousel, drawer, pull-to-refresh"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#149651] text-sm font-bold text-white">inp</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "输入交互" : "Input Interaction"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "表单校验、实时搜索、自动补全" : "Form validation, live search, autocomplete"}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "静态组件 → 可交互 demo" : "Static component → interactive demo"}</p>
                    </>
                  )}

                  {(activeCommand === "/interface-flow" || activeCommand === "/界面流程") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Analyze flow...</li>
                        <li>2. Generate screens...</li>
                        <li>3. Link transitions...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-1 flex-col items-center gap-1">
                            <div className="h-14 w-full rounded-lg border border-[#d7eaff] bg-[#f6fbff]" />
                            <span className="text-[0.72rem] text-[#96a0ae]">{isZh ? "首页" : "Home"}</span>
                          </div>
                          <span className="text-[#0099ff]">→</span>
                          <div className="flex flex-1 flex-col items-center gap-1">
                            <div className="h-14 w-full rounded-lg border border-[#d7eaff] bg-[#f6fbff]" />
                            <span className="text-[0.72rem] text-[#96a0ae]">{isZh ? "列表" : "List"}</span>
                          </div>
                          <span className="text-[#0099ff]">→</span>
                          <div className="flex flex-1 flex-col items-center gap-1">
                            <div className="h-14 w-full rounded-lg border border-[#d7eaff] bg-[#f6fbff]" />
                            <span className="text-[0.72rem] text-[#96a0ae]">{isZh ? "详情" : "Detail"}</span>
                          </div>
                          <span className="text-[#0099ff]">→</span>
                          <div className="flex flex-1 flex-col items-center gap-1">
                            <div className="h-14 w-full rounded-lg border border-[#d7eaff] bg-[#f6fbff]" />
                            <span className="text-[0.72rem] text-[#96a0ae]">{isZh ? "结果" : "Result"}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "单一需求 → 完整交互流程" : "Single requirement → complete interaction flow"}</p>
                    </>
                  )}

                  {(activeCommand === "/optimize" || activeCommand === "/重塑") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Profile loading...</li>
                        <li>2. Analyze renders...</li>
                        <li>3. Check animations...</li>
                        <li>4. Optimize images...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-4 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#ef5348] text-sm font-bold text-white">P0</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "未压缩图片 (2.4MB)" : "Uncompressed images (2.4MB)"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "转换为 WebP + 懒加载" : "Convert to WebP + lazy load"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#f1bb49] text-sm font-bold text-white">P1</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "布局属性动画" : "Layout property animations"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "改用 transform + opacity" : "Switch to transform + opacity"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#0099ff] text-sm font-bold text-white">P2</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "未使用的 CSS 规则" : "Unused CSS rules"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "Tree-shake 或移除" : "Tree-shake or remove"}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "性能问题定位 → 结构化修复方案" : "Performance issues → structured fix plan"}</p>
                    </>
                  )}

                  {(activeCommand === "/harden" || activeCommand === "/模仿") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Check error states...</li>
                        <li>2. Test i18n...</li>
                        <li>3. Handle overflow...</li>
                        <li>4. Cover edge cases...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-4 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#ef5348] text-xs text-white">✕</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "网络错误无回退" : "No fallback for network errors"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "添加错误边界 + 重试按钮" : "Add error boundary + retry button"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#f1bb49] text-xs text-white">!</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "长文本截断" : "Long text truncation"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "添加 text-overflow 与 tooltip" : "Add text-overflow + tooltip"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#f1bb49] text-xs text-white">!</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "空状态缺失" : "Missing empty states"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "设计引导性空态页面" : "Design guided empty state"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#22ad48] text-xs text-white">✓</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "RTL 布局支持" : "RTL layout support"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "已使用逻辑属性" : "Already using logical properties"}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "脆弱界面 → 健壮的生产级 UI" : "Fragile UI → production-ready resilience"}</p>
                    </>
                  )}

                  {(activeCommand === "/switch-style" || activeCommand === "/切换风格") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Parse layout...</li>
                        <li>2. Apply style tokens...</li>
                        <li>3. Render comparison...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-[#e8ebf0] bg-white p-4 text-center">
                            <span className="text-xs font-semibold tracking-[0.08em] text-[#96a0ae]">QQ</span>
                            <div className="mx-auto mt-3 h-8 w-full rounded-lg bg-[#0099ff]" />
                            <div className="mx-auto mt-2 h-3 w-[60%] rounded-full bg-[#e0f0ff]" />
                          </div>
                          <div className="rounded-lg border border-[#e8ebf0] bg-white p-4 text-center">
                            <span className="text-xs font-semibold tracking-[0.08em] text-[#96a0ae]">WeChat</span>
                            <div className="mx-auto mt-3 h-8 w-full rounded-lg bg-[#07c160]" />
                            <div className="mx-auto mt-2 h-3 w-[60%] rounded-full bg-[#d8f5e5]" />
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "同一结构 → 不同品牌风格对比" : "Same structure → different brand style comparison"}</p>
                    </>
                  )}

                  {(activeCommand === "/switch-icons" || activeCommand === "/切换图标库") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Extract icon semantics...</li>
                        <li>2. Map to target library...</li>
                        <li>3. Render comparison...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-[#e8ebf0] bg-white p-4">
                            <span className="text-xs font-semibold tracking-[0.08em] text-[#96a0ae]">QUI Icons</span>
                            <div className="mt-3 flex gap-3">
                              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#edf6ff] text-lg">🏠</span>
                              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#edf6ff] text-lg">⚙️</span>
                              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#edf6ff] text-lg">👤</span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-[#e8ebf0] bg-white p-4">
                            <span className="text-xs font-semibold tracking-[0.08em] text-[#96a0ae]">SF Symbols</span>
                            <div className="mt-3 flex gap-3">
                              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#f3f0ff] text-lg">🏡</span>
                              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#f3f0ff] text-lg">⚙</span>
                              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#f3f0ff] text-lg">🧑</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "同一语义 → 不同图标库对比" : "Same semantics → different icon library comparison"}</p>
                    </>
                  )}

                  {(activeCommand === "/check-code" || activeCommand === "/检查代码") && (
                    <>
                      <ol className="space-y-1.5 text-[1.95rem] leading-[1.1] text-[#1b202a]">
                        <li>1. Scan components...</li>
                        <li>2. Validate tokens...</li>
                        <li>3. Report issues...</li>
                        <li>4. Auto-fix...</li>
                        <li className="text-[#22ad48]">✓ complete</li>
                      </ol>
                      <div className="space-y-3 rounded-xl border border-[#ececf1] bg-[#fafbfc] p-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#22ad48] text-xs text-white">✓</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "组件引用正确" : "Component references correct"}</p>
                            <p className="text-xs text-[#7f8591]">12/12 passed</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#ef5348] text-xs text-white">✕</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "Token 不规范" : "Invalid tokens"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "3 处硬编码颜色值 → 已替换为 token" : "3 hardcoded colors → replaced with tokens"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#f1bb49] text-xs text-white">!</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1b202a]">{isZh ? "间距不一致" : "Inconsistent spacing"}</p>
                            <p className="text-xs text-[#7f8591]">{isZh ? "2 处间距偏差 → 已修正" : "2 spacing deviations → fixed"}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[1.02rem] text-[#626978]">{isZh ? "生成代码 → 规范校验 + 自动修复" : "Generated code → spec validation + auto-fix"}</p>
                    </>
                  )}

                </motion.div>
              </AnimatePresence>
            </article>
          </div>

          <p className="col-span-full mt-10 text-[1.02rem] text-[#7f8591]">
            {isZh ? "有好用的 skill？" : "Have a great skill?"}
            <button type="button" className="ml-1 font-semibold text-[#0099ff] transition hover:opacity-75">
              {isZh ? "贡献一个 skill →" : "Contribute a skill →"}
            </button>
          </p>
        </section>

        <section id="get-started" className="mt-18 border-t border-[rgba(16,20,30,.08)] pt-10">
          <p className="text-[16px] leading-none tracking-[0.012em] text-[#949aa4]">03</p>
          <h2 className="mt-10 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.06] tracking-[-0.02em] text-[#121317]">
            {isZh ? "开始使用" : "Get Started"}
          </h2>
          <p className="mt-4 text-[clamp(1.02rem,1.5vw,1.5rem)] leading-[1.36] text-[#1f2532]">
            {isZh ? "一步开始 Qdesign 设计。" : "One step to Qdesign."}
          </p>

          <div className="mx-auto mt-10 w-full max-w-[830px] space-y-9">
            <div className="flex items-start gap-6">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#00adff] text-[1.2rem] font-semibold leading-none text-[#00a8ff]">1</span>
              <div className="pt-1">
                <p className="font-serif text-[1.5rem] leading-[1.04] text-[#111318]">{isZh ? "安装 skills" : "Install the skills"}</p>
                <p className="mt-2 text-[1.08rem] leading-[1.16] text-[#7f8591]">{isZh ? "一条命令，适配所有开发工具。" : "One command. Every provider."}</p>
              </div>
            </div>

            <article className="overflow-hidden rounded-[10px] border border-[#ececf0] bg-white shadow-[0_26px_58px_-40px_rgba(55,64,84,0.33)]">
              <div className="flex items-center justify-between border-b border-[#f2f2f5] bg-[#fbfafb] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="size-3.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-3.5 rounded-full bg-[#febc2e]" />
                  <span className="size-3.5 rounded-full bg-[#28c840]" />
                </div>
              </div>

              <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-9 sm:py-8">
                <div className="min-w-0">
                  <p className="font-mono text-[clamp(0.95rem,1.8vw,1.6rem)] leading-[1.15] text-[#12151d]">
                    <span aria-hidden="true" className="mr-2 inline-flex select-none text-[#00a6ff]">
                      <svg viewBox="0 0 24 24" className="size-5 sm:size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h5" />
                        <path d="M7.5 8.5L11 12l-3.5 3.5" />
                      </svg>
                    </span>
                    <span className="whitespace-nowrap">npx skills add <span className="relative inline-block w-[1ch] overflow-hidden align-bottom" style={{ color: "transparent", caretColor: "transparent" }}><span className="select-all">qkj91927</span><span className="pointer-events-none absolute left-0 top-0 select-none" style={{ color: "#12151d" }} aria-hidden="true">*</span></span>/QQ_GenUI</span>
                  </p>
                  <p className="mt-3 max-w-[980px] text-[clamp(0.88rem,1.2vw,1.15rem)] leading-[1.34] text-[#7f8591]">
                    {isZh
                      ? "直接复制到 Codebuddy、With、Workbuddy、Claude Code、Codex、Cursor 等工具即可。"
                      : "Just copy and paste in Codebuddy, With, Workbuddy, Claude Code, Codex, Cursor, and more."}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={copiedCommand === "install" ? "Copied" : "Copy install command"}
                  onClick={() => handleCopyCommand(installCommand, "install")}
                  className={`mt-1 inline-flex h-10 w-[88px] shrink-0 items-center justify-center gap-1.5 rounded-lg text-[0.88rem] font-semibold transition ${copiedCommand === "install" ? "border border-[#0099ff] bg-[#0099ff] text-white" : "border border-[#0099ff] bg-white text-[#0099ff] hover:bg-[#f0f8ff]"}`}
                >
                  {copiedCommand === "install" ? null : (
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                    </svg>
                  )}
                  {copiedCommand === "install" ? (isZh ? "已复制" : "Copied") : (isZh ? "复制" : "Copy")}
                </button>
              </div>
            </article>

            <div className="mt-20 flex items-start gap-6">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#00adff] text-[1.2rem] font-semibold leading-none text-[#00a8ff]">2</span>
              <div className="pt-1">
                <p className="font-serif text-[1.5rem] leading-[1.04] text-[#111318]">{isZh ? "输入你的 prompts" : "Input your prompts"}</p>
                <p className="mt-2 text-[1.08rem] leading-[1.16] text-[#7f8591]">{isZh ? "skills 可搭配任意 prompts 使用。" : "Use skills with any prompts."}</p>
              </div>
            </div>

            <article className="overflow-hidden rounded-[10px] border border-[#ececf0] bg-white shadow-[0_26px_58px_-40px_rgba(55,64,84,0.33)]">
              <div className="flex items-center justify-between border-b border-[#f2f2f5] bg-[#fbfafb] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="size-3.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-3.5 rounded-full bg-[#febc2e]" />
                  <span className="size-3.5 rounded-full bg-[#28c840]" />
                </div>
              </div>

              <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-9 sm:py-8">
                <div className="min-w-0">
                  <p className="text-[clamp(0.95rem,1.5vw,1.35rem)] leading-[1.3] text-[#12151d]">
                    <span aria-hidden="true" className="mr-2 inline-flex select-none text-[#00a6ff]">
                      <svg viewBox="0 0 24 24" className="size-5 sm:size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h5" />
                        <path d="M7.5 8.5L11 12l-3.5 3.5" />
                      </svg>
                    </span>
                    {useCommand}
                  </p>
                  <p className="mt-3 max-w-[980px] text-[clamp(0.88rem,1.2vw,1.15rem)] leading-[1.34] text-[#7f8591]">
                    {isZh
                      ? "你可以让 skills 搭配任意 prompts，直接发送给 agent，等待 magic 发生。"
                      : "You can use any prompts with skills, just send to agent and wait for magic."}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={copiedCommand === "use" ? "Copied" : "Copy use command"}
                  onClick={() => handleCopyCommand(useCommand, "use")}
                  className={`mt-1 inline-flex h-10 w-[88px] shrink-0 items-center justify-center gap-1.5 rounded-lg text-[0.88rem] font-semibold transition ${copiedCommand === "use" ? "border border-[#0099ff] bg-[#0099ff] text-white" : "border border-[#0099ff] bg-white text-[#0099ff] hover:bg-[#f0f8ff]"}`}
                >
                  {copiedCommand === "use" ? null : (
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                    </svg>
                  )}
                  {copiedCommand === "use" ? (isZh ? "已复制" : "Copied") : (isZh ? "复制" : "Copy")}
                </button>
              </div>
            </article>

            <p className="max-w-[830px] text-[0.92rem] leading-[1.7] text-[#636c7a]">
              {isZh ? "建议把" : "Keep the"}
              <Link
                href="/cheatsheet"
                className="mx-2 inline-flex items-center rounded-full border border-[#8ad6ff] bg-[#edf7ff] px-3 py-1 text-[0.92rem] font-semibold text-[#0099ff] transition hover:-translate-y-px hover:border-[#0099ff] hover:bg-[#0099ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
              >
                {isZh ? "command cheatsheet" : "command cheatsheet"}
              </Link>
              {isZh ? "放在手边便于快速查看。更新 skills 时运行" : "handy for quick reference. To update skills, run"}
              <span className="ml-2 inline-flex rounded-md border border-[#8ad6ff] bg-[#e6f5ff] px-2 py-0.5 text-[#00a9ff]">npx skills update</span>.
            </p>

          </div>
        </section>

        <section id="changelog" className="mt-20 border-t border-[rgba(16,20,30,.08)] pt-10">
          <p className="text-[16px] leading-none tracking-[0.012em] text-[#949aa4]">04</p>
          <h2 className="mt-10 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.04] tracking-[-0.02em] text-[#141518]">
            {isZh ? "最新动态" : "What's New"}
          </h2>

          <article className="mt-10 max-w-[980px] space-y-5 text-[0.95rem] leading-[1.55] text-[#222734]">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[1.5rem] font-semibold leading-none text-[#101218]">v1.3.0</p>
              <p className="text-[0.92rem] text-[#8d94a1]">April 7, 2026</p>
            </div>

            <ul className="space-y-3.5 pl-6 marker:text-[#20242d]">
              <li>{isZh ? "图标绑定完善，支持更多图标语义映射" : "Icon binding improved with broader semantic mapping"}</li>
              <li>{isZh ? "新增半屏模态组件规则" : "New half-screen modal component rules"}</li>
              <li>{isZh ? "优化组件规范的交互状态描述" : "Improved interaction state descriptions in component specs"}</li>
              <li>{isZh ? "修复部分组件变体的组合规则缺失问题" : "Fixed missing composition rules for some component variants"}</li>
            </ul>

            <button className="pt-6 text-[0.92rem] font-semibold text-[#0099ff] transition hover:opacity-75">+ View older releases</button>
          </article>

          <div className="mx-auto mt-12 w-full max-w-[980px]">
            <div className="pl-0 pt-1 sm:pl-[80px]">
                <p className="font-serif text-[1.5rem] leading-[1.04] text-[#111318]">{isZh ? "保持更新" : "Stay up to date"}</p>
                <p className="mt-2 text-[clamp(0.92rem,1.2vw,1.08rem)] leading-[1.16] text-[#7f8591]">{isZh ? "发布新版本时，我们将通过企微邮件通知你。" : "New skills, pattern updates, and design tips."}</p>
            </div>

            <article className="mt-7 rounded-[10px] border border-[#ececf0] bg-white px-4 py-5 sm:px-7 sm:py-8">
              <div className="mx-auto w-full max-w-[560px] rounded-xl border border-[#2bb3ff] bg-white p-1.5">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:gap-0">
                  <input
                    type="email"
                    placeholder={isZh ? "输入你的邮箱..." : "Type your email..."}
                    className="h-12 border-0 px-4 text-[clamp(0.92rem,1.2vw,1.3rem)] text-[#8a8f98] placeholder:text-[#b4b8be] focus:outline-none sm:h-13 sm:px-5"
                  />
                  <button type="button" className="h-12 rounded-[10px] bg-[#35b6ff] px-6 text-[clamp(0.92rem,1.2vw,1.35rem)] font-semibold text-white sm:h-13 sm:px-8">
                    {isZh ? "订阅" : "Subscribe"}
                  </button>
                </div>
              </div>

              <p className="mx-auto mt-4 max-w-[760px] text-center text-[1.02rem] leading-[1.35] text-[#8c919a]">
                {isZh
                  ? "订阅即表示你同意我们的使用条款和隐私政策。"
                  : <>By subscribing you agree to
                    <span className="mx-1 underline">Substack&apos;s Terms of Use</span>,
                    <span className="mx-1 underline">our Privacy Policy</span> and
                    <span className="ml-1 underline">our Information collection notice</span></>}
              </p>

            </article>


          </div>
        </section>

        <section id="faq" className="mt-16 border-t border-[rgba(16,20,30,.08)] pt-10">
          <p className="text-[16px] leading-none tracking-[0.012em] text-[#949aa4]">05</p>
          <h2 className="mt-10 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-[#141518]">
            {isZh ? "常见问题" : "Frequently Asked Questions"}
          </h2>

          <div className="mt-12 border-y border-[rgba(16,20,30,.08)]">
            {localizedFaqItems.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article key={faq.question} className="border-b border-[rgba(16,20,30,.08)] last:border-b-0">
                  <button
                    className="flex min-h-20 w-full items-center justify-between gap-4 py-6 text-left"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.2] tracking-[-0.01em] text-[#1a1d24]">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 0.94 : 1 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 text-[1.9rem] leading-none text-[#0099ff]"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.22, ease: "easeOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-3xl pb-6 pr-12 text-[0.94rem] leading-8 text-[#5c6472]">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
