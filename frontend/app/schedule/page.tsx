"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, CheckSquare, Mail, TrendingUp, BarChart2, PieChart,
  Newspaper, Bookmark, Star, Search, FileText, StickyNote,
  Sparkles, ArrowRight, RotateCcw, MapPin, Clock, AlignLeft, CheckCircle2,
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
  "w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2C73D2]/30 focus:border-[#2C73D2]/40 focus:bg-white transition";

interface EventDraft {
  title: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
  location: string;
}

type PageState = "chat" | "preview" | "saving" | "success" | "error";

function formatDisplay(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", weekday: "short",
    });
  } catch {
    return iso;
  }
}

function toLocalInputValue(iso: string) {
  if (!iso) return "";
  // datetime-local input needs "YYYY-MM-DDTHH:mm"
  return iso.slice(0, 16);
}

export default function SchedulePage() {
  const [input, setInput] = useState("");
  const [pageState, setPageState] = useState<PageState>("chat");
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (pageState === "chat") textareaRef.current?.focus();
  }, [pageState]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    setThinking(true);
    setErrorMsg("");

    const now = new Date();
    const today = now.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "long",
    });

    const prompt = `오늘 날짜: ${today}
당신은 일정 등록 도우미입니다. 사용자의 요청을 분석하여 구글 캘린더에 등록할 일정 정보를 추출한 뒤 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

{"title":"일정제목","startDateTime":"YYYY-MM-DDTHH:mm:00","endDateTime":"YYYY-MM-DDTHH:mm:00","description":"설명(없으면 빈 문자열)","location":"장소(없으면 빈 문자열)"}

규칙:
- 시간이 명시되지 않으면 09:00으로 설정
- 종료 시간이 없으면 시작 시간 + 1시간
- "내일", "다음 주" 등 상대 날짜는 오늘 날짜 기준으로 절대 날짜로 변환

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
      if (!jsonMatch) throw new Error("일정 형식을 파싱할 수 없습니다.");
      setDraft(JSON.parse(jsonMatch[0]));
      setPageState("preview");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setThinking(false);
    }
  }

  async function handleSave() {
    if (!draft) return;
    setPageState("saving");
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "등록 실패");
      }
      setPageState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "등록 중 오류가 발생했습니다.");
      setPageState("error");
    }
  }

  function handleReset() {
    setInput(""); setDraft(null); setPageState("chat"); setErrorMsg("");
  }

  function updateDraft(field: keyof EventDraft, value: string) {
    setDraft((d) => d ? { ...d, [field]: value } : d);
  }

  /* 성공 */
  if (pageState === "success") {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-base font-medium text-neutral-800">구글 캘린더에 등록되었습니다.</p>
          {draft && (
            <div className="text-center text-sm text-neutral-500 space-y-0.5">
              <p className="font-medium text-neutral-700">{draft.title}</p>
              <p>{formatDisplay(draft.startDateTime)}</p>
            </div>
          )}
          <button onClick={handleReset}
            className="mt-2 flex items-center gap-1.5 text-xs text-[#2C73D2] hover:underline">
            <RotateCcw className="h-3.5 w-3.5" /> 새 일정 등록
          </button>
        </div>
      </PageShell>
    );
  }

  /* 미리보기 */
  if (pageState === "preview" || pageState === "saving" || pageState === "error") {
    return (
      <PageShell>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#2C73D2] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Gemini가 추출한 일정
            </span>
            <button onClick={handleReset}
              className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> 다시 입력
            </button>
          </div>

          <div className="rounded-2xl border border-[#2C73D2]/20 bg-[#2C73D2]/5 px-5 py-4 space-y-4">
            {/* 제목 */}
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">일정 제목</p>
              <input className={cn(inputCls, "bg-white font-medium")} value={draft?.title ?? ""}
                onChange={(e) => updateDraft("title", e.target.value)} placeholder="일정 제목" />
            </div>

            {/* 시작/종료 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Clock className="h-3 w-3 text-neutral-400" />
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">시작</p>
                </div>
                <input type="datetime-local" className={cn(inputCls, "bg-white")}
                  value={toLocalInputValue(draft?.startDateTime ?? "")}
                  onChange={(e) => updateDraft("startDateTime", e.target.value + ":00")} />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Clock className="h-3 w-3 text-neutral-400" />
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">종료</p>
                </div>
                <input type="datetime-local" className={cn(inputCls, "bg-white")}
                  value={toLocalInputValue(draft?.endDateTime ?? "")}
                  onChange={(e) => updateDraft("endDateTime", e.target.value + ":00")} />
              </div>
            </div>

            {/* 장소 */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <MapPin className="h-3 w-3 text-neutral-400" />
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">장소</p>
              </div>
              <input className={cn(inputCls, "bg-white")} value={draft?.location ?? ""}
                onChange={(e) => updateDraft("location", e.target.value)} placeholder="장소 (선택)" />
            </div>

            {/* 설명 */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <AlignLeft className="h-3 w-3 text-neutral-400" />
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">설명</p>
              </div>
              <textarea rows={3} className={cn(inputCls, "bg-white resize-none")} value={draft?.description ?? ""}
                onChange={(e) => updateDraft("description", e.target.value)} placeholder="설명 (선택)" />
            </div>
          </div>

          {pageState === "error" && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button onClick={handleSave} disabled={pageState === "saving"}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2C73D2] text-white text-sm font-medium py-3 hover:bg-[#2563b8] disabled:opacity-50 disabled:cursor-not-allowed transition">
            <Calendar className="h-4 w-4" />
            {pageState === "saving" ? "등록 중..." : "구글 캘린더에 등록"}
          </button>
        </div>
      </PageShell>
    );
  }

  /* 채팅 입력 */
  return (
    <PageShell>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#2C73D2]" />
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">AI에게 일정 말하기</span>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(e); } }}
            placeholder={"예) 다음 주 화요일 오후 2시에 팀 미팅 2시간, 회의실 A\n예) 내일 오전 10시 치과 예약\n예) 매주 금요일 오후 6시 요가 클래스"}
            rows={5}
            className={cn(inputCls, "resize-none")}
          />
          <p className="mt-2 text-[11px] text-neutral-400">
            날짜, 시간, 내용을 자연어로 입력하세요. Gemini가 일정을 추출해 구글 캘린더에 등록합니다.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <button type="submit" disabled={!input.trim() || thinking}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2C73D2] text-white text-sm font-medium py-3 hover:bg-[#2563b8] disabled:opacity-50 disabled:cursor-not-allowed transition">
          {thinking ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Gemini가 일정 분석 중...
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4" /> 일정 추출하기
            </>
          )}
        </button>
      </form>
    </PageShell>
  );
}

/* ─── 공통 레이아웃 래퍼 ────────────────────────────────── */
function PageShell({ children }: { children: React.ReactNode }) {
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
                  key === "Schedule" ? "text-[#2C73D2]" : cn("text-neutral-400", hoverClass))}>
                {label}
              </Link>
            ))}
          </nav>
          <AuthLoginButton className="shrink-0 rounded-none border-0 bg-transparent px-0 py-0 text-[11px] font-medium tracking-wide text-neutral-400 shadow-none hover:bg-transparent hover:text-[#2C73D2]" />
        </div>
      </header>

      <div className="fixed inset-x-0 top-11 z-[55] h-10 bg-white" />

      <main className="min-h-screen bg-white pt-[84px]">
        <section className="border-b border-neutral-100 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2C73D2]/10 to-[#0081CF]/10">
            <Calendar className="h-6 w-6 text-[#2C73D2]" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">일정 등록</h1>
          <p className="mt-2 text-sm text-neutral-400">Gemini + n8n을 통해 구글 캘린더에 등록됩니다.</p>
        </section>

        <section className="mx-auto max-w-xl px-6 py-10">
          {children}
        </section>
      </main>
    </>
  );
}
