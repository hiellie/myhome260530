"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar, CheckSquare, Mail, TrendingUp, BarChart2, PieChart,
  Newspaper, Bookmark, Star, Search, FileText, StickyNote,
  Inbox, ShieldCheck, Plus, Trash2, RefreshCw, Sparkles, X, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthLoginButton } from "@/components/auth/AuthLoginButton";

const NAV_ITEMS = [
  { key: "Schedule",  label: "Schedule",  href: "/schedule",  hoverClass: "hover:text-[#2C73D2]" },
  { key: "Todo",      label: "To do",     href: "/dashboard", hoverClass: "hover:text-[#008F7A]" },
  { key: "Mailbox",   label: "Mailbox",   href: "/mailbox",   hoverClass: "hover:text-[#845EC2]" },
  { key: "Mail",      label: "Mail",      href: "/mail",      hoverClass: "hover:text-[#FF6363]" },
  { key: "Finance",   label: "Finance",   href: "/dashboard", hoverClass: "hover:text-[#00B4D8]" },
  { key: "MyStock",   label: "My Stock",  href: "/dashboard", hoverClass: "hover:text-[#06C96A]" },
  { key: "MyAssets",  label: "My Assets", href: "/dashboard", hoverClass: "hover:text-[#F77F00]" },
  { key: "News",      label: "News",      href: "/dashboard", hoverClass: "hover:text-[#E63946]" },
  { key: "Scrap",     label: "Files",     href: "/dashboard", hoverClass: "hover:text-[#4361EE]" },
  { key: "Interests", label: "Interests", href: "/dashboard", hoverClass: "hover:text-[#F72585]" },
  { key: "Research",  label: "Research",  href: "/dashboard", hoverClass: "hover:text-[#7B2FBE]" },
  { key: "Reports",   label: "Reports",   href: "/dashboard", hoverClass: "hover:text-[#0081CF]" },
  { key: "Memo",      label: "Memo",      href: "/dashboard", hoverClass: "hover:text-[#FB8500]" },
] as const;

interface Sender { id: number; email: string; name: string; created_at: string; }
interface Email {
  id: number; from_email: string; from_name: string;
  subject: string; body: string; received_at: string;
  summary: string; is_read: boolean;
}
type Tab = "inbox" | "allowlist";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

/* ─── 허용 목록 탭 ──────────────────────────────────────── */
function AllowlistTab() {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/mailbox/allowlist");
    const data = await res.json();
    if (data.ok) setSenders(data.senders);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setAdding(true);
    await fetch("/api/mailbox/allowlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput, name: nameInput }),
    });
    setEmailInput(""); setNameInput("");
    setAdding(false);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/mailbox/allowlist?id=${id}`, { method: "DELETE" });
    setSenders((s) => s.filter((x) => x.id !== id));
  }

  const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#845EC2]/30 transition";

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 space-y-3">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> 발신자 추가
        </p>
        <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
          placeholder="허용할 이메일 주소" className={inputCls} />
        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
          placeholder="이름 (선택)" className={inputCls} />
        <button type="submit" disabled={adding}
          className="w-full rounded-xl bg-[#845EC2] text-white text-sm font-medium py-2.5 hover:bg-[#6d4aaa] disabled:opacity-50 transition">
          {adding ? "추가 중..." : "허용 목록에 추가"}
        </button>
      </form>

      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> 허용된 발신자 ({senders.length}명)
        </p>
        {loading ? (
          <div className="text-sm text-neutral-400 text-center py-6">불러오는 중...</div>
        ) : senders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-400">
            아직 허용된 발신자가 없습니다.
          </div>
        ) : (
          <ul className="space-y-2">
            {senders.map((s) => (
              <li key={s.id}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-800">{s.name || s.email}</p>
                  {s.name && <p className="text-xs text-neutral-400">{s.email}</p>}
                </div>
                <button onClick={() => handleDelete(s.id)}
                  className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-400 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── 수신함 탭 ─────────────────────────────────────────── */
function InboxTab() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selected, setSelected] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    const res = await fetch("/api/mailbox/emails");
    const data = await res.json();
    if (data.ok) setEmails(data.emails);
    setLoading(false); setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSelect(email: Email) {
    setSelected(email);
    if (!email.is_read) {
      await fetch("/api/mailbox/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id }),
      });
      setEmails((es) => es.map((e) => e.id === email.id ? { ...e, is_read: true } : e));
    }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/mailbox/emails?id=${id}`, { method: "DELETE" });
    setEmails((es) => es.filter((e) => e.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  if (loading) {
    return <div className="text-sm text-neutral-400 text-center py-12">불러오는 중...</div>;
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition">
          <ChevronLeft className="h-3.5 w-3.5" /> 목록으로
        </button>
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">{selected.subject || "(제목 없음)"}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {selected.from_name ? `${selected.from_name} <${selected.from_email}>` : selected.from_email}
                {" · "}{timeAgo(selected.received_at)}
              </p>
            </div>
            <button onClick={() => handleDelete(selected.id)}
              className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-400 transition shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {selected.summary && (
            <div className="flex gap-2 rounded-xl bg-[#845EC2]/5 border border-[#845EC2]/15 p-3">
              <Sparkles className="h-3.5 w-3.5 text-[#845EC2] shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-600 leading-relaxed">{selected.summary}</p>
            </div>
          )}

          <div className="border-t border-neutral-100 pt-4">
            <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
              {selected.body || "(내용 없음)"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          수신된 메일 ({emails.length}개)
        </p>
        <button onClick={() => load(true)} disabled={refreshing}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition">
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          새로고침
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center space-y-2">
          <Inbox className="h-8 w-8 text-neutral-200 mx-auto" />
          <p className="text-sm text-neutral-400">수신된 메일이 없습니다.</p>
          <p className="text-xs text-neutral-300">허용 목록에 발신자를 추가하고 n8n을 설정하세요.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {emails.map((email) => (
            <li key={email.id} onClick={() => handleSelect(email)}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition",
                email.is_read
                  ? "border-neutral-100 bg-white hover:bg-neutral-50"
                  : "border-[#845EC2]/20 bg-[#845EC2]/5 hover:bg-[#845EC2]/10"
              )}>
              <div className="shrink-0 mt-1.5">
                <span className={cn("block h-2 w-2 rounded-full", email.is_read ? "bg-neutral-200" : "bg-[#845EC2]")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-sm truncate", email.is_read ? "text-neutral-600" : "font-semibold text-neutral-900")}>
                    {email.from_name || email.from_email}
                  </p>
                  <span className="text-[10px] text-neutral-400 shrink-0">{timeAgo(email.received_at)}</span>
                </div>
                <p className={cn("text-xs truncate mt-0.5", email.is_read ? "text-neutral-400" : "text-neutral-700")}>
                  {email.subject || "(제목 없음)"}
                </p>
                {email.summary && (
                  <p className="text-xs text-neutral-400 truncate mt-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#845EC2] shrink-0" />
                    {email.summary}
                  </p>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }}
                className="shrink-0 rounded-lg p-1 text-neutral-300 hover:text-red-400 transition">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── 메인 페이지 ───────────────────────────────────────── */
export default function MailboxPage() {
  const [tab, setTab] = useState<Tab>("inbox");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-screen-xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" className="shrink-0 flex items-baseline gap-[3px]">
            <span className="text-[15px] font-light tracking-widest text-neutral-800 uppercase">Ellie</span>
            <span className="text-[15px] font-semibold tracking-widest uppercase bg-gradient-to-r from-[#845EC2] to-[#2C73D2] bg-clip-text text-transparent">Kim</span>
          </Link>
          <nav className="flex flex-1 items-center justify-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_ITEMS.map(({ key, label, href, hoverClass }) => (
              <Link key={key} href={href}
                className={cn("shrink-0 text-[11px] font-medium tracking-wide transition-colors",
                  key === "Mailbox" ? "text-[#845EC2]" : cn("text-neutral-400", hoverClass))}>
                {label}
              </Link>
            ))}
          </nav>
          <AuthLoginButton className="shrink-0 rounded-none border-0 bg-transparent px-0 py-0 text-[11px] font-medium tracking-wide text-neutral-400 shadow-none hover:bg-transparent hover:text-[#845EC2]" />
        </div>
      </header>

      <div className="fixed inset-x-0 top-11 z-[55] h-10 bg-white" />

      <main className="min-h-screen bg-white pt-[84px]">
        <section className="border-b border-neutral-100 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2]/10 to-[#2C73D2]/10">
            <Inbox className="h-6 w-6 text-[#845EC2]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">수신함</h1>
          <p className="mt-2 text-sm text-neutral-400">Gemini가 허용된 발신자 메일만 필터링합니다.</p>
        </section>

        <section className="mx-auto max-w-xl px-6 py-10">
          <div className="flex gap-1 mb-8 p-1 rounded-xl bg-neutral-100">
            <button onClick={() => setTab("inbox")}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                tab === "inbox" ? "bg-white text-[#845EC2] shadow-sm" : "text-neutral-500 hover:text-neutral-700")}>
              <Inbox className="h-3.5 w-3.5" /> 수신함
            </button>
            <button onClick={() => setTab("allowlist")}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                tab === "allowlist" ? "bg-white text-[#845EC2] shadow-sm" : "text-neutral-500 hover:text-neutral-700")}>
              <ShieldCheck className="h-3.5 w-3.5" /> 허용 목록
            </button>
          </div>

          {tab === "inbox" ? <InboxTab /> : <AllowlistTab />}
        </section>
      </main>
    </>
  );
}
