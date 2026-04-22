"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

/* ─── Nav ─── */
const navEn = [
  { label: "Home", href: "/" },
  { label: "Cases", href: "/cases" },
  { label: "Skills", href: "/skills" },
  { label: "Cheatsheet", href: "/cheatsheet" },
];
const navZh = [
  { label: "首页", href: "/" },
  { label: "实战案例", href: "/cases" },
  { label: "skill 库", href: "/skills" },
  { label: "Cheatsheet", href: "/cheatsheet" },
];

/* ─── Skill data ─── */
type Skill = {
  id: string;
  name: string;
  nameZh: string;
  version: string;
  author: string;
  tag: string;
  tagZh: string;
  desc: string;
  descZh: string;
  highlights: string[];
  highlightsZh: string[];
  repo: string;
  installCmd: string;
  official: boolean;
};

const skills: Skill[] = [
  {
    id: "qq-genui-basic",
    name: "QQ-GENUI-basic1.0",
    nameZh: "QQ-GENUI-basic1.0",
    version: "1.0",
    author: "QQ GenUI",
    tag: "Core",
    tagZh: "核心",
    desc: "The foundational skill that converts QQ GenUI design system specs into production mobile pages. Enforces a strict 11-stage Gate workflow with Knot MCP auto spec retrieval, icon localization, background color constraints, and up to 3 rounds of regression testing across 5 audit dimensions.",
    descZh: "核心基础 skill，将 QQ GenUI 设计系统规范转化为生产级移动端页面。强制执行 11 阶段 Gate 流程，通过 Knot MCP 按需检索组件规范，图标本地化，背景色强约束，最多 3 轮 5 维度回归测试。",
    highlights: [
      "11-stage Gate workflow (Gate -1 → Gate 10)",
      "Auto component spec retrieval via Knot MCP",
      "Icon localization from GitHub to local assets",
      "5-dimension regression: components, structure, layout, icons, interactions",
    ],
    highlightsZh: [
      "11 阶段 Gate 流程（Gate -1 → Gate 10）",
      "通过 Knot MCP 按需检索组件规范",
      "图标从 GitHub 远程仓库本地化下载",
      "5 维度回归：组件细则、结构语义、版式细节、图标、交互行为",
    ],
    repo: "https://github.com/qkj91927/QQ_GenUI/tree/main/skills/QQ-GENUI-basic1.0",
    installCmd: "npx skills add qkj91927/QQ_GenUI --skill QQ-GENUI-basic1.0",
    official: true,
  },
  {
    id: "live-spec",
    name: "live-spec",
    nameZh: "live-spec",
    version: "1.0",
    author: "QQ GenUI",
    tag: "Spec",
    tagZh: "规范",
    desc: "Turn static design specs into a live, interactive workbench. Generates both a pure page HTML and an Inspector workbench HTML with left canvas + right Inspector panel, supporting click-to-select components, real-time token editing, and postMessage communication.",
    descZh: "将静态设计规范变成活的交互式工作台。同时产出纯页面 HTML 和带左画布 + 右 Inspector 面板的工作台 HTML，支持点选组件、实时编辑 Token、postMessage 双向通信。",
    highlights: [
      "Dual output: page HTML + Inspector workbench",
      "Click-to-select with real-time token editing",
      "Strict Basic 1.0 component mapping (21 components)",
      "8 hard rules (R1–R8) including Edit mode protocol",
    ],
    highlightsZh: [
      "双文件产出：纯页面 HTML + Inspector 工作台",
      "点选组件 + 实时编辑 Token 值",
      "严格映射 Basic 1.0 的 21 个母组件",
      "8 条硬性规则（R1–R8），含 Edit 模式通信协议",
    ],
    repo: "https://github.com/qkj91927/QQ_GenUI/tree/main/skills/live-spec",
    installCmd: "npx skills add qkj91927/QQ_GenUI --skill live-spec",
    official: true,
  },
  {
    id: "switch-style",
    name: "switch-style",
    nameZh: "switch-style",
    version: "1.0",
    author: "QQ GenUI",
    tag: "Style",
    tagZh: "风格",
    desc: "Transform any existing UI into a target brand's visual style while preserving structure and content. Reads brand DESIGN.md for precise token mapping across 6 dimensions. Supports 58 brand design systems including Apple, Stripe, Tesla, Figma, and more.",
    descZh: "在保持页面结构和内容不变的前提下，将任意 UI 界面切换为目标品牌的视觉风格。读取品牌 DESIGN.md 进行 6 维度精准 Token 映射。支持 58 个品牌设计系统，包括 Apple、Stripe、Tesla、Figma 等。",
    highlights: [
      "58 brand design systems supported",
      "6 dimensions: color, typography, components, layout, depth, special",
      "Auto light/dark mode handling",
      "Strict DESIGN.md compliance with Do's and Don'ts",
    ],
    highlightsZh: [
      "支持 58 个品牌设计系统",
      "6 维度覆盖：颜色、排版、组件、布局、深度、特殊处理",
      "自动处理亮色/暗色模式",
      "严格遵循 DESIGN.md 的 Do's and Don'ts 规范",
    ],
    repo: "https://github.com/qkj91927/QQ_GenUI/tree/main/skills/switch-style",
    installCmd: "npx skills add qkj91927/QQ_GenUI --skill switch-style",
    official: true,
  },
  {
    id: "demo-to-phone",
    name: "demo-to-phone",
    nameZh: "demo-to-phone",
    version: "1.0",
    author: "QQ GenUI",
    tag: "Tool",
    tagZh: "工具",
    desc: "Publish local HTML files online and generate QR code pages with QQ WebView parameters. Includes mobile adaptation preprocessing (disable zoom, hide status bar, responsive scaling) before upload. Scan with QQ to preview demos on your phone instantly.",
    descZh: "将本地 HTML 文件发布到线上，生成带 QQ WebView 参数的访问链接并自动创建二维码页面。发布前自动进行手机适配预处理（禁用缩放、隐藏状态栏、响应式适配），用 QQ 扫码即可在手机上体验 demo。",
    highlights: [
      "Mobile adaptation preprocessing (4 steps)",
      "One-click publish HTML to COS",
      "Auto QQ WebView parameter injection",
      "QR code page generation for instant preview",
    ],
    highlightsZh: [
      "手机适配预处理（4 步自动完成）",
      "一键发布 HTML 到 COS",
      "自动注入 QQ WebView 参数",
      "自动生成二维码页面，扫码即可预览",
    ],
    repo: "https://github.com/qkj91927/QQ_GenUI/tree/main/skills/demo-to-phone",
    installCmd: "npx skills add qkj91927/QQ_GenUI --skill demo-to-phone",
    official: true,
  },
  {
    id: "skill-creator",
    name: "skill-creator",
    nameZh: "skill-creator",
    version: "1.0",
    author: "QQ GenUI",
    tag: "Dev",
    tagZh: "开发",
    desc: "Create new skills, modify and improve existing skills, and measure skill performance. Features an iterative development cycle with blind A/B eval testing, benchmark variance analysis, and description optimization for better triggering accuracy.",
    descZh: "创建新 skill、修改和改进现有 skill、评估 skill 性能。采用迭代开发循环，支持盲测 A/B 评估、基准方差分析、描述优化以提高触发准确率。",
    highlights: [
      "Iterative skill development cycle",
      "Blind A/B eval testing (skill vs baseline)",
      "Benchmark variance analysis",
      "Description optimization for trigger accuracy",
    ],
    highlightsZh: [
      "迭代式 skill 开发循环",
      "盲测 A/B 对比评估（有 skill vs 无 skill）",
      "基准方差分析",
      "优化描述提升触发准确率",
    ],
    repo: "https://github.com/qkj91927/QQ_GenUI/tree/main/skills/skill-creator",
    installCmd: "npx skills add qkj91927/QQ_GenUI --skill skill-creator",
    official: true,
  },
];

const tagColor: Record<string, { bg: string; text: string }> = {
  Core: { bg: "bg-[#edf6ff]", text: "text-[#0077cc]" },
  核心: { bg: "bg-[#edf6ff]", text: "text-[#0077cc]" },
  Spec: { bg: "bg-[#fef3f2]", text: "text-[#c4320a]" },
  规范: { bg: "bg-[#fef3f2]", text: "text-[#c4320a]" },
  Style: { bg: "bg-[#fff4e6]", text: "text-[#b8700a]" },
  风格: { bg: "bg-[#fff4e6]", text: "text-[#b8700a]" },
  Tool: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  工具: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  Dev: { bg: "bg-[#faf5ff]", text: "text-[#7c3aed]" },
  开发: { bg: "bg-[#faf5ff]", text: "text-[#7c3aed]" },
  Community: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  社区: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
};

/* ─── Page ─── */
export function SkillsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLangState] = useState<"en" | "zh">(() => (searchParams.get("lang") === "en" ? "en" : "zh"));
  const isZh = lang === "zh";
  const localizedNav = isZh ? navZh : navEn;

  const setLang = useCallback(
    (l: "en" | "zh") => {
      setLangState(l);
      const params = new URLSearchParams(window.location.search);
      if (l === "en") params.set("lang", "en"); else params.delete("lang");
      const qs = params.toString();
      router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  const [mobileNav, setMobileNav] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitDone, setSubmitDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!submitUrl.trim()) return;
    setSubmitDone(true);
    setTimeout(() => { setSubmitDone(false); setSubmitOpen(false); setSubmitUrl(""); }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(255,255,255,0.94)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1140px] items-center justify-between px-4 sm:h-18 sm:px-7 lg:px-10">
          <Link href={isZh ? "/" : "/?lang=en"} className="font-serif text-[clamp(1.5rem,2.4vw,3rem)] italic leading-none tracking-[-0.02em] text-[#0f1012]">
            QQ GenUI
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {localizedNav.map((item) => {
              const hrefWithLang = `${item.href}${!isZh ? "?lang=en" : ""}`;
              const isActive = item.href === "/skills";
              return (
                <Link key={item.label} href={hrefWithLang}>
                  <span className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${isActive ? "bg-[#f0f1f4] text-[#181a1e]" : "text-[#2a2d33] hover:bg-[#f3f4f6]"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
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
      <main className="mx-auto w-full max-w-[1140px] px-4 pb-20 pt-10 sm:px-7 sm:pt-14 lg:px-10">
        {/* Hero */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[15px] leading-none tracking-[0.012em] text-[#949aa4]">skill {isZh ? "库" : "Library"}</p>
            <h1 className="mt-6 font-serif text-[clamp(2.4rem,4.8vw,4rem)] leading-[0.96] tracking-[-0.025em] text-[#0b0d13]">
              {isZh ? "探索 Skills" : "Explore Skills"}
            </h1>
            <p className="mt-4 max-w-[640px] text-[clamp(1rem,1.3vw,1.18rem)] leading-[1.72] text-[#505764]">
              {isZh
                ? "每个 skill 是一套可复用的设计能力封装，让 agent 在特定场景下产出更精准、更规范的界面。你也可以贡献自己的 skill。"
                : "Each skill is a reusable design capability package that helps agents produce more precise, spec-compliant interfaces in specific scenarios. You can also contribute your own."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSubmitOpen(true)}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full border border-[#0099ff] bg-white px-6 text-[0.95rem] font-semibold text-[#0099ff] transition hover:bg-[#f0f8ff]"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            {isZh ? "提交 Skill" : "Submit Skill"}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex rounded-full border border-[#e2e5ea] bg-white px-4 py-1.5 text-[0.84rem] text-[#8f95a0]">
            {skills.length} skills
          </span>
          <span className="inline-flex rounded-full border border-[#e2e5ea] bg-white px-4 py-1.5 text-[0.84rem] text-[#8f95a0]">
            {skills.filter(s => s.official).length} {isZh ? "官方" : "official"}
          </span>
        </div>

        {/* Skill cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {skills.map((skill, i) => {
            const tag = isZh ? skill.tagZh : skill.tag;
            const tc = tagColor[tag] || { bg: "bg-[#f3f4f6]", text: "text-[#505764]" };

            return (
              <motion.article
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#ececf1] bg-white transition hover:border-[#d0e6ff] hover:shadow-[0_20px_50px_-28px_rgba(0,120,255,0.15)]"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#f0f1f4] bg-[#fafafc] px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-mono text-[1.1rem] font-semibold text-[#12151d]">{skill.name}</h2>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${tc.bg} ${tc.text}`}>{tag}</span>
                      {skill.official && (
                        <span className="shrink-0 rounded-full bg-[#0099ff] px-2 py-0.5 text-[0.68rem] font-semibold text-white">{isZh ? "官方" : "Official"}</span>
                      )}
                    </div>
                    <p className="mt-1 text-[0.82rem] text-[#96a0ae]">v{skill.version} · {skill.author}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
                  <p className="text-[0.95rem] leading-[1.72] text-[#505764]">
                    {isZh ? skill.descZh : skill.desc}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {(isZh ? skill.highlightsZh : skill.highlights).map((h, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[0.88rem] leading-[1.5] text-[#6b7280]">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0099ff]" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center gap-2 rounded-lg border border-[#ececf1] bg-[#fafafc] px-4 py-3">
                      <span className="mr-1 text-[#00a6ff]">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h5" /><path d="M7.5 8.5L11 12l-3.5 3.5" /></svg>
                      </span>
                      <code className="flex-1 truncate font-mono text-[0.84rem] text-[#12151d]">{skill.installCmd.includes("qkj91927") ? (<>
                        {skill.installCmd.split("qkj91927")[0]}<span className="relative inline-block w-[1ch] overflow-hidden align-bottom" style={{ color: "transparent", caretColor: "transparent" }}><span className="select-all">qkj91927</span><span className="pointer-events-none absolute left-0 top-0 select-none" style={{ color: "#12151d" }} aria-hidden="true">*</span></span>{skill.installCmd.split("qkj91927")[1]}
                      </>) : skill.installCmd}</code>
                      <button
                        type="button"
                        onClick={() => {
                          const text = skill.installCmd;
                          const done = () => { setCopiedId(skill.id); setTimeout(() => setCopiedId(null), 2000); };
                          if (navigator.clipboard?.writeText) {
                            navigator.clipboard.writeText(text).then(done).catch(() => {
                              const ta = document.createElement("textarea");
                              ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
                              document.body.appendChild(ta); ta.select(); document.execCommand("copy");
                              document.body.removeChild(ta); done();
                            });
                          } else {
                            const ta = document.createElement("textarea");
                            ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
                            document.body.appendChild(ta); ta.select(); document.execCommand("copy");
                            document.body.removeChild(ta); done();
                          }
                        }}
                        className={`shrink-0 rounded-md border px-2.5 py-1 text-[0.78rem] font-medium transition ${copiedId === skill.id ? "border-[#0099ff] bg-[#0099ff] text-white" : "border-[#e2e5ea] bg-white text-[#7f8591] hover:border-[#0099ff] hover:text-[#0099ff]"}`}
                      >
                        {copiedId === skill.id ? (isZh ? "已复制" : "Copied") : (isZh ? "复制" : "Copy")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}

          {/* Coming soon placeholder */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cdd2da] bg-[#fafbfc] px-6 py-12 text-center">
            <span className="text-[2rem] leading-none text-[#c4c9d2]">+</span>
            <p className="mt-3 text-[1.02rem] font-medium text-[#96a0ae]">{isZh ? "更多 skill 即将上线" : "More skills coming soon"}</p>
            <p className="mt-1 text-[0.88rem] text-[#b4b8c2]">{isZh ? "持续更新中..." : "Stay tuned..."}</p>
          </div>
        </div>

        {/* How to contribute */}
        <section className="mt-16 border-t border-[rgba(16,20,30,.08)] pt-10">
          <h2 className="font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.06] tracking-[-0.02em] text-[#121317]">
            {isZh ? "贡献 Skill" : "Contribute a Skill"}
          </h2>
          <p className="mt-4 max-w-[720px] text-[clamp(1rem,1.3vw,1.14rem)] leading-[1.72] text-[#505764]">
            {isZh
              ? "如果你开发了好用的 skill，欢迎提交给我们。只需提供 skill 项目的 GitHub 链接，管理员审核通过后会收录到 skill 库中。"
              : "If you've built a great skill, we'd love to include it. Simply submit your skill's GitHub repository link, and after admin review, it will be added to the skill library."}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", titleZh: "开发你的 Skill", titleEn: "Build Your Skill", descZh: "按照 SKILL.md 规范开发你的 skill，确保包含完整的 references 目录和描述文件。", descEn: "Develop your skill following the SKILL.md spec, ensuring it includes a complete references directory and description file." },
              { step: "2", titleZh: "提交链接", titleEn: "Submit the Link", descZh: "点击上方\u201c提交 Skill\u201d按钮，填入你的 skill 项目 GitHub 链接即可。", descEn: "Click the \"Submit Skill\" button above and paste your skill's GitHub repository link." },
              { step: "3", titleZh: "审核上线", titleEn: "Review & Publish", descZh: "管理员会审核你的 skill 质量和规范符合性，通过后自动加入 skill 库。", descEn: "Admins will review your skill for quality and spec compliance. Once approved, it's automatically added." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-[#ececf1] bg-white px-5 py-5">
                <span className="inline-flex size-10 items-center justify-center rounded-full border-2 border-[#0099ff] text-[1.1rem] font-semibold text-[#0099ff]">{item.step}</span>
                <p className="mt-4 text-[1.05rem] font-semibold text-[#12151d]">{isZh ? item.titleZh : item.titleEn}</p>
                <p className="mt-2 text-[0.92rem] leading-[1.65] text-[#7f8591]">{isZh ? item.descZh : item.descEn}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(16,20,30,.08)]">
        <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between px-4 py-10 sm:px-7 lg:px-10">
          <p className="font-serif text-[1.1rem] italic leading-none tracking-[-0.02em] text-[#b4b8c2]">QQ GenUI</p>
          <p className="text-[0.84rem] text-[#9ea3ac]">© 2026 QQ GenUI</p>
        </div>
      </footer>

      {/* ── Submit modal ── */}
      <AnimatePresence>
        {submitOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.4)] p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSubmitOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[480px] rounded-2xl border border-[#ececf1] bg-white p-6 shadow-[0_32px_80px_-28px_rgba(21,24,34,0.35)] sm:p-8"
            >
              {submitDone ? (
                <div className="py-6 text-center">
                  <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#edf6ff] text-[1.6rem] text-[#0099ff]">✓</span>
                  <p className="mt-4 text-[1.15rem] font-semibold text-[#12151d]">{isZh ? "提交成功！" : "Submitted!"}</p>
                  <p className="mt-2 text-[0.95rem] text-[#7f8591]">{isZh ? "管理员将尽快审核你的 skill。" : "An admin will review your skill soon."}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-[1.5rem] leading-none text-[#12151d]">{isZh ? "提交 Skill" : "Submit a Skill"}</h3>
                    <button type="button" onClick={() => setSubmitOpen(false)} className="inline-flex size-9 items-center justify-center rounded-lg text-[1.2rem] text-[#96a0ae] transition hover:bg-[#f3f4f6]">×</button>
                  </div>
                  <p className="mt-3 text-[0.92rem] leading-[1.6] text-[#7f8591]">
                    {isZh
                      ? "提交你的 skill 项目 GitHub 链接，管理员审核通过后会加入到 skill 库。"
                      : "Submit your skill's GitHub repository link. After admin review, it'll be added to the library."}
                  </p>
                  <div className="mt-5">
                    <label className="text-[0.84rem] font-medium text-[#505764]">{isZh ? "GitHub 链接" : "GitHub URL"}</label>
                    <input
                      type="url"
                      value={submitUrl}
                      onChange={(e) => setSubmitUrl(e.target.value)}
                      placeholder="https://github.com/username/skill-repo"
                      className="mt-2 h-12 w-full rounded-xl border border-[#e2e5ea] bg-white px-4 text-[0.95rem] text-[#1b1d21] outline-none placeholder:text-[#b4b8c2] focus:border-[#0099ff]"
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setSubmitOpen(false)} className="rounded-lg border border-[#e2e5ea] px-5 py-2.5 text-[0.92rem] font-medium text-[#505764] transition hover:bg-[#f7f8fa]">
                      {isZh ? "取消" : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!submitUrl.trim()}
                      className="rounded-lg bg-[#0099ff] px-5 py-2.5 text-[0.92rem] font-semibold text-white transition hover:bg-[#0088e6] disabled:opacity-40"
                    >
                      {isZh ? "提交" : "Submit"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
