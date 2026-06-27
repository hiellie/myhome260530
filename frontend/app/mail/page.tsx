"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, CheckSquare, Mail, TrendingUp, BarChart2, PieChart,
  Newspaper, Bookmark, Star, Search, FileText, StickyNote,
  Send, User, AlignLeft, Sparkles, ArrowRight, RotateCcw,
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

const inputCls =
  "w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#845EC2]/30 focus:border-[#845EC2]/40 focus:bg-white transition";

/* ─── 직접 작성 탭 ─────────────────────────────────────── */
function DirectTab() {
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
      setTo(""); setSubject(""); setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "전송 중 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-3.5 w-3.5 text-neutral-400" />
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">받는 사람</label>
          </div>
          <input type="email" required value={to} onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com" className={inputCls} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">제목</label>
          </div>
          <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
            placeholder="메일 제목을 입력하세요" className={inputCls} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlignLeft className="h-3.5 w-3.5 text-neutral-400" />
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">내용</label>
          </div>
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="메일 내용을 입력하세요" rows={7}
            className={cn(inputCls, "resize-none")} />
        </div>
      </div>

      {status === "success" && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          메일이 성공적으로 전송되었습니다.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button type="submit" disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#845EC2] text-white text-sm font-medium py-3 hover:bg-[#6d4aaa] disabled:opacity-50 disabled:cursor-not-allowed transition">
        <Send className="h-4 w-4" />
        {status === "sending" ? "전송 중..." : "메일 보내기"}
      </button>
    </form>
  );
}

/* ─── AI 작성 탭 ────────────────────────────────────────── */
interface MailDraft { to: string; subject: string; body: string; }
type AiState = "chat" | "preview" | "sending" | "success" | "error";

function AiTab() {
  const [input, setInput] = useState("");
  const [aiState, setAiState] = useState<AiState>("chat");
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState<MailDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (aiState === "chat") textareaRef.current?.focus();
  }, [aiState]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    setThinking(true);
    setErrorMsg("");

    const prompt = `당신은 메일 작성 도우미입니다. 사용자의 요청을 바탕으로 전문적인 한국어 메일을 작성한 뒤 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.
{"to":"수신자이메일","subject":"메일제목","body":"메일본문"}
규칙: to는 요청에서 이메일 주소 추출(없으면 빈 문자열), subject는 간결한 제목, body는 정중한 한국어 본문(인사말 포함, 서명 제외).
사용자 요청: ${input}`;

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: prompt }],
          modelKey: "fast",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gemini 오류");

      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("메일 형식을 파싱할 수 없습니다.");
      setDraft(JSON.parse(jsonMatch[0]));
      setAiState("preview");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setThinking(false);
    }
  }

  async function handleSend() {
    if (!draft) return;
    setAiState("sending");
    try {
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: draft.to, subject: draft.subject, message: draft.body }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "전송 실패");
      }
      setAiState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "전송 중 오류가 발생했습니다.");
      setAiState("error");
    }
  }

  function handleReset() {
    setInput(""); setDraft(null); setAiState("chat"); setErrorMsg("");
  }

  if (aiState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center">
          <Send className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm text-neutral-600">메일이 성공적으로 전송되었습니다.</p>
        <button onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-[#845EC2] hover:underline">
          <RotateCcw className="h-3.5 w-3.5" /> 새 메일 작성
        </button>
      </div>
    );
  }

  if (aiState === "preview" || aiState === "sending" || aiState === "error") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#845EC2] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Gemini가 작성한 메일
          </span>
          <button onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> 다시 작성
          </button>
        </div>

        <div className="rounded-2xl border border-[#845EC2]/20 bg-[#845EC2]/5 px-5 py-4 space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">받는 사람</p>
            <input className={cn(inputCls, "bg-white")} value={draft?.to ?? ""}
              onChange={(e) => setDraft((d) => d ? { ...d, to: e.target.value } : d)} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">제목</p>
            <input className={cn(inputCls, "bg-white")} value={draft?.subject ?? ""}
              onChange={(e) => setDraft((d) => d ? { ...d, subject: e.target.value } : d)} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">내용</p>
            <textarea rows={8} className={cn(inputCls, "bg-white resize-none")} value={draft?.body ?? ""}
              onChange={(e) => setDraft((d) => d ? { ...d, body: e.target.value } : d)} />
          </div>
        </div>

        {aiState === "error" && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button onClick={handleSend} disabled={aiState === "sending"}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#845EC2] text-white text-sm font-medium py-3 hover:bg-[#6d4aaa] disabled:opacity-50 disabled:cursor-not-allowed transition">
          <Send className="h-4 w-4" />
          {aiState === "sending" ? "전송 중..." : "이 메일로 보내기"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-[#845EC2]" />
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">AI에게 요청</span>
        </div>
        <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(e); } }}
          placeholder={"예) hiellie@naver.com에게 다음 주 화요일 오후 2시 미팅 일정 확인 메일 보내줘"}
          rows={5} className={cn(inputCls, "resize-none")} />
        <p className="mt-2 text-[11px] text-neutral-400">
          수신자 이메일과 전달할 내용을 간단히 적어주세요. Gemini가 메일을 완성합니다.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button type="submit" disabled={!input.trim() || thinking}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#845EC2] text-white text-sm font-medium py-3 hover:bg-[#6d4aaa] disabled:opacity-50 disabled:cursor-not-allowed transition">
        {thinking ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Gemini가 메일 작성 중...
          </>
        ) : (
          <>
            <ArrowRight className="h-4 w-4" /> 메일 초안 생성
          </>
        )}
      </button>
    </form>
  );
}

/* ─── 메인 페이지 ───────────────────────────────────────── */
type Tab = "direct" | "ai";

export default function MailPage() {
  const [tab, setTab] = useState<Tab>("direct");

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
                  key === "Mail" ? "text-[#845EC2]" : cn("text-neutral-400", hoverClass))}>
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
            <Mail className="h-6 w-6 text-[#845EC2]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">메일 보내기</h1>
          <p className="mt-2 text-sm text-neutral-400">n8n을 통해 Gmail로 전송됩니다.</p>
        </section>

        <section className="mx-auto max-w-xl px-6 py-10">
          <div className="flex gap-1 mb-8 p-1 rounded-xl bg-neutral-100">
            <button onClick={() => setTab("direct")}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                tab === "direct" ? "bg-white text-[#845EC2] shadow-sm" : "text-neutral-500 hover:text-neutral-700")}>
              <Send className="h-3.5 w-3.5" /> 직접 작성
            </button>
            <button onClick={() => setTab("ai")}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                tab === "ai" ? "bg-white text-[#845EC2] shadow-sm" : "text-neutral-500 hover:text-neutral-700")}>
              <Sparkles className="h-3.5 w-3.5" /> AI 작성
            </button>
          </div>

          {tab === "direct" ? <DirectTab /> : <AiTab />}
        </section>
      </main>
    </>
  );
}
