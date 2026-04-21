"use client";

import { cheatsheetGroups } from "@/data/site-content";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CopyFeedback = {
  cmd: string;
  status: "success" | "error";
};

const navItemsEn = [
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

export function CheatsheetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLangState] = useState<"en" | "zh">(() => (searchParams.get("lang") === "en" ? "en" : "zh"));
  const isZh = lang === "zh";

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

  const localizedNav = isZh ? navItemsZh : navItemsEn;

  const [activeTab, setActiveTab] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groups = useMemo(() => {
    const base = activeTab === "all" ? cheatsheetGroups : cheatsheetGroups.filter((g) => g.id === activeTab);
    if (!keyword.trim()) return base;
    return base
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.cmd.toLowerCase().includes(keyword.toLowerCase()) ||
            item.detail.includes(keyword) ||
            item.output.includes(keyword)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [activeTab, keyword]);

  const totalRows = useMemo(() => groups.reduce((s, g) => s + g.items.length, 0), [groups]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    return () => { if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current); };
  }, []);

  const clearFeedbackLater = () => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setCopyFeedback(null);
      setAnnouncement("");
    }, 1400);
  };

  const handleCopy = async (cmd: string) => {
    const fallbackCopy = (text: string) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;top:0;left:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (!ok) throw new Error("copy failed");
    };

    try {
      if (navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText(cmd); } catch { fallbackCopy(cmd); }
      } else {
        fallbackCopy(cmd);
      }
      setCopyFeedback({ cmd, status: "success" });
      setAnnouncement(`Copied: ${cmd}`);
      clearFeedbackLater();
    } catch {
      setCopyFeedback({ cmd, status: "error" });
      setAnnouncement("Copy failed. Please try again.");
      clearFeedbackLater();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Header (matches home page) ── */}
      <header className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.94)]">
        <div className="mx-auto flex h-18 w-full max-w-[1140px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <Link href={isZh ? "/" : "/?lang=en"} className="font-serif text-[clamp(1.85rem,2.6vw,3rem)] italic leading-none tracking-[-0.02em] text-[#0f1012]">
            Qdesign
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {localizedNav.map((item) => {
              const hrefWithLang = `${item.href}${!isZh ? "?lang=en" : ""}`;
              const isActive = item.href === "/cheatsheet";
              return (
                <Link key={item.label} href={hrefWithLang}>
                  <span className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${isActive ? "bg-[#f0f1f4] text-[#181a1e]" : "text-[#2a2d33] hover:bg-[#f3f4f6]"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-[#e2e5ea] bg-white p-0.5 text-[12px] font-medium text-[#6e7480]">
              <button type="button" onClick={() => setLang("en")} className={`inline-flex size-9 items-center justify-center rounded-full leading-none transition ${!isZh ? "bg-[#111318] text-white" : "text-[#6e7480] hover:bg-[#f4f6f9]"}`}>E</button>
              <button type="button" onClick={() => setLang("zh")} className={`inline-flex size-9 items-center justify-center rounded-full leading-none transition ${isZh ? "bg-[#111318] text-white" : "text-[#6e7480] hover:bg-[#f4f6f9]"}`}>中</button>
            </div>
            <button type="button" className="rounded-full border border-[#14161b] bg-[#111318] px-5 py-2.5 text-sm font-semibold text-[#f8f9fb] transition hover:bg-[#0b0d12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2">
              {isZh ? "登录" : "Sign In"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1140px] px-4 pb-22 pt-10 sm:px-7 lg:px-10">
        {/* Hero */}
        <p className="text-[16px] leading-none tracking-[0.012em] text-[#949aa4]">Cheatsheet</p>
        <h1 className="mt-8 font-serif text-[clamp(2.35rem,4.1vw,3.5rem)] leading-[1.01] tracking-[-0.02em] text-[#11131a]">
          {isZh ? "命令速查" : "Command Cheatsheet"}
        </h1>
        <p className="mt-4 max-w-[680px] text-[clamp(1.02rem,1.35vw,1.22rem)] leading-[1.72] text-[#505764]">
          {isZh
            ? "快速筛选高频命令模板，用于页面实现、组件规范与交付阶段对齐。"
            : "Quickly filter high-frequency command templates for page implementation, component specs, and delivery alignment."}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex rounded-full border border-[#e2e5ea] bg-white px-4 py-1.5 text-[0.82rem] tracking-[0.06em] text-[#8f95a0]">
            {totalRows} {isZh ? "条命令" : "COMMANDS"}
          </span>
          <span className="text-[0.82rem] text-[#b4b8c2]">
            {isZh ? "按" : "Press"} <kbd className="mx-1 rounded border border-[#e2e5ea] bg-white px-1.5 py-0.5 font-mono text-[0.78rem] text-[#0099ff]">/</kbd> {isZh ? "聚焦搜索" : "to search"}
          </span>
        </div>

        {/* Filter bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-[10px] border border-[#ececf1] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full border px-3.5 py-1.5 text-[0.88rem] font-medium transition ${activeTab === "all" ? "border-[#0099ff] bg-[#edf7ff] text-[#0099ff]" : "border-[#e2e5ea] text-[#7f8591] hover:bg-[#f7f8fa]"}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            {cheatsheetGroups.map((g) => (
              <button
                key={g.id}
                className={`rounded-full border px-3.5 py-1.5 text-[0.88rem] font-medium transition ${activeTab === g.id ? "border-[#0099ff] bg-[#edf7ff] text-[#0099ff]" : "border-[#e2e5ea] text-[#7f8591] hover:bg-[#f7f8fa]"}`}
                onClick={() => setActiveTab(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={isZh ? "搜索命令或说明..." : "Search commands..."}
              className="w-full rounded-xl border border-[#e2e5ea] bg-white px-4 py-2.5 text-[0.92rem] text-[#1b1d21] outline-none placeholder:text-[#b4b8c2] focus:border-[#0099ff] sm:w-[260px]"
            />
            {keyword && (
              <button onClick={() => setKeyword("")} className="rounded-xl border border-[#e2e5ea] px-3 text-[0.88rem] text-[#7f8591] transition hover:bg-[#f7f8fa]">
                {isZh ? "清除" : "Clear"}
              </button>
            )}
          </div>
        </div>

        <p aria-live="polite" className="mt-2 text-[0.82rem] text-[#b4b8c2]">
          {announcement || (keyword.trim() ? `${isZh ? "显示" : "Showing"} ${totalRows} ${isZh ? "条匹配" : "matches"}` : "")}
        </p>

        {/* Command groups */}
        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <article key={group.id} className="overflow-hidden rounded-[10px] border border-[#ececf1] bg-white">
              <div className="border-b border-[#f0f1f4] bg-[#fafafc] px-6 py-4">
                <h2 className="font-serif text-[1.3rem] tracking-[-0.01em] text-[#1a1d24]">{group.label}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-[0.92rem]">
                  <thead>
                    <tr className="border-b border-[#f0f1f4] text-[0.82rem] uppercase tracking-[0.08em] text-[#96a0ae]">
                      <th className="px-6 py-3 font-medium">Command</th>
                      <th className="px-6 py-3 font-medium">Detail</th>
                      <th className="px-6 py-3 font-medium">Output</th>
                      <th className="px-6 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item) => {
                      const copied = copyFeedback?.cmd === item.cmd && copyFeedback.status === "success";
                      const failed = copyFeedback?.cmd === item.cmd && copyFeedback.status === "error";
                      return (
                        <tr key={item.cmd} className="border-b border-[rgba(16,20,30,.05)] align-top last:border-transparent">
                          <td className="px-6 py-4 font-mono text-[0.88rem] font-semibold text-[#0099ff]">{item.cmd}</td>
                          <td className="px-6 py-4 text-[#505764]">{item.detail}</td>
                          <td className="px-6 py-4 text-[#7f8591]">{item.output}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleCopy(item.cmd)}
                              className={`rounded-lg border px-3 py-1.5 text-[0.82rem] font-medium transition ${copied ? "border-[#0099ff] bg-[#0099ff] text-white" : "border-[#e2e5ea] text-[#7f8591] hover:border-[#0099ff] hover:text-[#0099ff]"}`}
                            >
                              {copied ? (isZh ? "已复制" : "Copied") : failed ? (isZh ? "重试" : "Retry") : (isZh ? "复制" : "Copy")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          ))}

          {groups.length === 0 && (
            <div className="space-y-4 rounded-[10px] border border-dashed border-[#cdd2da] bg-[#fafbfc] p-10 text-center">
              <p className="text-[1.02rem] text-[#7f8591]">{isZh ? "未找到匹配项" : "No matches found"}</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {["prompt", "delivery", "workflow"].map((k) => (
                  <button
                    key={k}
                    onClick={() => setKeyword(k)}
                    className="rounded-full border border-[#e2e5ea] bg-white px-4 py-1.5 text-[0.88rem] text-[#7f8591] transition hover:border-[#0099ff] hover:text-[#0099ff]"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[rgba(16,20,30,.08)]">
        <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between px-4 py-10 sm:px-7 lg:px-10">
          <p className="font-serif text-[1.1rem] italic leading-none tracking-[-0.02em] text-[#b4b8c2]">Qdesign</p>
          <p className="text-[0.84rem] text-[#9ea3ac]">© 2026 Qdesign</p>
        </div>
      </footer>
    </div>
  );
}
