"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, CheckSquare, Mail, TrendingUp, BarChart2, PieChart, Newspaper, Bookmark, Star, Search, FileText, StickyNote, Send, User, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthLoginButton } from "@/components/auth/AuthLoginButton";

const NAV_ITEMS = [
  { key: "Schedule",  label: "Schedule",  icon: Calendar,    href: "/dashboard" },
  { key: "Todo",      label: "To do",     icon: CheckSquare, href: "/dashboard" },
  { key: "Mail",      label: "Mail",      icon: Mail,        href: "/mail" },
  { key: "Finance",   label: "Finance",   icon: TrendingUp,  href: "/dashboard" },
  { key: "MyStock",   label: "My Stock",  icon: BarChart2,   href: "/dashboard" },
  { key: "MyAssets",  label: "My Assets", icon: PieChart,    href: "/dashboard" },
  { key: "News",      label: "News",      icon: Newspaper,   href: "/dashboard" },
  { key: "Scrap",     label: "Files",     icon: Bookmark,    href: "/dashboard" },
  { key: "Interests", label: "Interests", icon: Star,        href: "/dashboard" },
  { key: "Research",  label: "Research",  icon: Search,      href: "/dashboard" },
  { key: "Reports",   label: "Reports",   icon: FileText,    href: "/dashboard" },
  { key: "Memo",      label: "Memo",      icon: StickyNote,  href: "/dashboard" },
] as const;

export default function MailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "전송 실패");
      }

      setStatus("success");
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "전송 중 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  const inputCls = "w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#845EC2]/30 focus:border-[#845EC2]/40 focus:bg-white transition";

  return (
    <>
      {/* Dashboard-style Nav */}
      <header className="fixed inset-x-0 top-0 z-[60] border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-screen-xl items-center justify-between gap-4 px-5 lg:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-baseline gap-[3px]">
            <span className="text-[15px] font-light tracking-widest text-neutral-800 uppercase">
              Ellie
            </span>
            <span className="text-[15px] font-semibold tracking-widest uppercase bg-gradient-to-r from-[#845EC2] to-[#2C73D2] bg-clip-text text-transparent">
              Kim
            </span>
          </Link>

          {/* Nav items */}
          <nav
            className="flex flex-1 items-center justify-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="대시보드 메뉴"
          >
            {NAV_ITEMS.map(({ key, label, href }) => (
              <Link
                key={key}
                href={href}
                className={cn(
                  "shrink-0 text-[11px] font-medium tracking-wide transition-colors",
                  key === "Mail"
                    ? "text-[#845EC2]"
                    : "text-neutral-400 hover:text-neutral-700",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Login */}
          <AuthLoginButton className="shrink-0 rounded-none border-0 bg-transparent px-0 py-0 text-[11px] font-medium tracking-wide text-neutral-400 shadow-none hover:bg-transparent hover:text-[#845EC2]" />
        </div>
      </header>

      {/* Covers the global SiteNav category sub-bar */}
      <div className="fixed inset-x-0 top-11 z-[55] h-10 bg-white" />

      {/* Main content */}
      <main className="min-h-screen bg-white pt-[84px]">
        <section className="border-b border-neutral-100 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2]/10 to-[#2C73D2]/10">
            <Mail className="h-6 w-6 text-[#845EC2]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            메일 보내기
          </h1>
          <p className="mt-2 text-sm text-neutral-400">n8n을 통해 Gmail로 전송됩니다.</p>
        </section>

        <section className="mx-auto max-w-xl px-6 py-10">
          <div className="mb-6 flex items-center gap-2 border-b border-neutral-100 pb-4">
            <Send className="h-4 w-4 text-[#845EC2]" />
            <h2 className="text-sm font-semibold text-neutral-700">새 메일 작성</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-3.5 w-3.5 text-neutral-400" />
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    받는 사람
                  </label>
                </div>
                <input
                  type="email"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-3.5 w-3.5 text-neutral-400" />
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    제목
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="메일 제목을 입력하세요"
                  className={inputCls}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft className="h-3.5 w-3.5 text-neutral-400" />
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    내용
                  </label>
                </div>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메일 내용을 입력하세요"
                  rows={7}
                  className={cn(inputCls, "resize-none")}
                />
              </div>
            </div>

            {status === "success" && (
              <div className="rounded-2xl bg-[#008F7A]/10 border border-[#008F7A]/20 px-5 py-3.5 text-sm text-[#008F7A] font-medium">
                메일이 성공적으로 전송되었습니다.
              </div>
            )}

            {status === "error" && (
              <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 text-sm text-red-500 font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-gradient-to-r from-[#845EC2] to-[#0081CF] py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "전송 중..." : "메일 보내기"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
