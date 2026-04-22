"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

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

export function AssetsPage() {
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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Header (matches home page) ── */}
      <header className="shrink-0 border-b border-[var(--border)] bg-[rgba(255,255,255,0.94)]">
        <div className="mx-auto flex h-18 w-full max-w-[1140px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <Link href={isZh ? "/" : "/?lang=en"} className="font-serif text-[clamp(1.85rem,2.6vw,3rem)] italic leading-none tracking-[-0.02em] text-[#0f1012]">
            QQ GenUI
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {localizedNav.map((item) => {
              const hrefWithLang = `${item.href}${!isZh ? "?lang=en" : ""}`;
              const isActive = item.href === "/assets";
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

      {/* Embedded component matrix — fills remaining viewport height */}
      <main className="flex-1">
        <iframe
          src="/basic-1.0/component-matrix.html"
          title={isZh ? "资产库 - 组件矩阵" : "Assets - Component Matrix"}
          className="block h-full w-full border-0"
          style={{ height: "calc(100vh - 72px)" }}
        />
      </main>
    </div>
  );
}
