import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qdesign - AI harnesses that elevate design quality",
  description: "A complete, AI-friendly QQ design specification. Component specs, design tokens, QUI icon library, and workflow skills — all out of the box.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          const ro = window.onerror;
          window.onerror = function(msg) {
            if (typeof msg === 'string' && msg.includes('ResizeObserver')) return true;
            return ro ? ro.apply(this, arguments) : false;
          };
        `}} />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">{children}</body>
    </html>
  );
}
