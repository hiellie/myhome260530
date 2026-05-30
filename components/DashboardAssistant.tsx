"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; text: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "assistant",
  text: "안녕하세요! 무엇이든 물어보세요.",
};

export function DashboardAssistant({ className }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, []);

  useEffect(() => { resizeTextarea(); }, [draft, resizeTextarea]);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", text };
    setDraft("");
    setError(null);
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/gemini/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text }], modelKey: "fast" }),
      });
      const data = (await res.json()) as { text?: string };
      if (!res.ok || !data.text?.trim()) throw new Error("응답을 받지 못했습니다.");
      setMessages((prev) => [...prev, { id: uid(), role: "assistant", text: data.text!.trim() }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setDraft(text);
    } finally {
      setLoading(false);
    }
  }, [draft, loading]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
  };

  return (
    <div className={cn("w-full rounded-2xl border border-neutral-200 bg-white overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2] to-[#0081CF]">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">AI Assistant</p>
          <p className="text-xs text-neutral-400">무엇이든 물어보세요</p>
        </div>
      </div>

      <div className="border-t border-neutral-100" />

      {/* Chat messages */}
      <div
        ref={listRef}
        className="flex flex-col gap-4 overflow-y-auto px-6 py-5"
        style={{ minHeight: "160px", maxHeight: "360px" }}
      >
        {messages.map((m) => (
          <div key={m.id} className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}>
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2] to-[#0081CF] mt-0.5">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "assistant"
                  ? "bg-neutral-100 text-neutral-800 rounded-tl-sm"
                  : "bg-gradient-to-r from-[#845EC2] to-[#0081CF] text-white rounded-tr-sm ml-auto",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2] to-[#0081CF] mt-0.5">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-2.5 text-sm text-neutral-400">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100" />

      {/* Input area */}
      <div className="flex items-end gap-3 px-6 py-4">
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-50"
          style={{ minHeight: "24px", maxHeight: "140px" }}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading || !draft.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2] to-[#0081CF] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="보내기"
        >
          <SendHorizontal className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      {error && (
        <p className="px-6 pb-4 text-xs text-rose-500" role="alert">{error}</p>
      )}
    </div>
  );
}
