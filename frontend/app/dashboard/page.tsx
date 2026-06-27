"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, CheckSquare, Mail, TrendingUp, TrendingDown, BarChart2, PieChart, Newspaper, Bookmark, Star, Search, FileText, StickyNote, Bot, FolderOpen, Table2, Heart, Package, Plane, ShoppingCart, PenLine, LayoutList, Briefcase, Timer, Building2 } from "lucide-react";

import { AuthLoginButton } from "@/components/auth/AuthLoginButton";
import { GeminiHeroChat } from "@/components/GeminiHeroChat";
import { DashboardAssistant } from "@/components/DashboardAssistant";
import { FilesBoard } from "@/components/files/FilesBoard";
import { FilesPostList } from "@/components/files/FilesPostList";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "Schedule",  label: "Schedule",  icon: Calendar,    href: "/schedule", hoverClass: "hover:text-[#2C73D2]" },
  { key: "Todo",      label: "To do",     icon: CheckSquare,                    hoverClass: "hover:text-[#008F7A]" },
  { key: "Mailbox",   label: "Mailbox",   icon: Mail,        href: "/mailbox",  hoverClass: "hover:text-[#845EC2]" },
  { key: "Mail",      label: "Mail",      icon: Mail,        href: "/mail",     hoverClass: "hover:text-[#FF6363]" },
  { key: "Finance",   label: "Finance",   icon: TrendingUp,                     hoverClass: "hover:text-[#00B4D8]" },
  { key: "MyStock",   label: "My Stock",  icon: BarChart2,                      hoverClass: "hover:text-[#06C96A]" },
  { key: "MyAssets",  label: "My Assets", icon: PieChart,                       hoverClass: "hover:text-[#F77F00]" },
  { key: "News",      label: "News",      icon: Newspaper,                      hoverClass: "hover:text-[#E63946]" },
  { key: "Scrap",     label: "Files",     icon: Bookmark,                       hoverClass: "hover:text-[#4361EE]" },
  { key: "Interests", label: "Interests", icon: Star,                           hoverClass: "hover:text-[#F72585]" },
  { key: "Research",  label: "Research",  icon: Search,                         hoverClass: "hover:text-[#7B2FBE]" },
  { key: "Reports",   label: "Reports",   icon: FileText,                       hoverClass: "hover:text-[#0081CF]" },
  { key: "Memo",      label: "Memo",      icon: StickyNote,                     hoverClass: "hover:text-[#FB8500]" },
] as const;

type TabKey = (typeof NAV_ITEMS)[number]["key"];

const FILES_SIDEBAR = [
  { key: "Board",       label: "글쓰기",       icon: PenLine,     activeText: "text-[#845EC2]", activeBg: "bg-[#845EC2]/10" },
  { key: "List",        label: "Board",        icon: LayoutList,  activeText: "text-[#0089BA]", activeBg: "bg-[#0089BA]/10" },
  { key: "MyDocuments", label: "My Documents", icon: FolderOpen,      activeText: "text-[#2C73D2]", activeBg: "bg-[#2C73D2]/10" },
  { key: "MyTables",    label: "My Tables",    icon: Table2,          activeText: "text-[#008E9B]", activeBg: "bg-[#008E9B]/10" },
  { key: "MyScraps",    label: "My Scraps",    icon: Bookmark,        activeText: "text-[#008F7A]", activeBg: "bg-[#008F7A]/10" },
] as const;

type FilesTabKey = (typeof FILES_SIDEBAR)[number]["key"];

const INTERESTS_SIDEBAR = [
  { key: "Hobbies",  label: "Hobbies",  icon: Heart,        activeText: "text-[#845EC2]", activeBg: "bg-[#845EC2]/10" },
  { key: "Items",    label: "Items",    icon: Package,      activeText: "text-[#2C73D2]", activeBg: "bg-[#2C73D2]/10" },
  { key: "Travel",   label: "Travel",   icon: Plane,        activeText: "text-[#008E9B]", activeBg: "bg-[#008E9B]/10" },
  { key: "Shopping", label: "Shopping", icon: ShoppingCart, activeText: "text-[#008F7A]", activeBg: "bg-[#008F7A]/10" },
] as const;

type InterestsTabKey = (typeof INTERESTS_SIDEBAR)[number]["key"];

const MYSTOCK_SIDEBAR = [
  { key: "MyPortfolio",    label: "My Portfolio",  icon: Briefcase,     activeText: "text-[#845EC2]", activeBg: "bg-[#845EC2]/10" },
  { key: "Short",          label: "Short",         icon: TrendingDown,  activeText: "text-[#2C73D2]", activeBg: "bg-[#2C73D2]/10" },
  { key: "Long",           label: "Long",          icon: TrendingUp,    activeText: "text-[#008E9B]", activeBg: "bg-[#008E9B]/10" },
  { key: "Hold",           label: "Hold",          icon: Timer,         activeText: "text-[#0089BA]", activeBg: "bg-[#0089BA]/10" },
] as const;

const MYSTOCK_ANALYSIS = [
  { key: "SamsungAnalysis", label: "삼성전자 분석", icon: Building2, activeText: "text-[#008F7A]", activeBg: "bg-[#008F7A]/10" },
] as const;

type StockTabKey =
  | (typeof MYSTOCK_SIDEBAR)[number]["key"]
  | (typeof MYSTOCK_ANALYSIS)[number]["key"];

// Palette: #845EC2 · #2C73D2 · #0081CF · #0089BA · #008E9B · #008F7A
const QUICK_STATS = [
  { label: "오늘 일정",   value: "3건",   sub: "2건 완료",    bg: "bg-[#845EC2]/10", text: "text-[#845EC2]" },
  { label: "미완료 할일", value: "5건",   sub: "오늘 마감 2", bg: "bg-[#2C73D2]/10", text: "text-[#2C73D2]" },
  { label: "관심 종목",  value: "+2.3%", sub: "코스피 기준",  bg: "bg-[#008E9B]/10", text: "text-[#008E9B]" },
  { label: "새 뉴스",    value: "12건",  sub: "오늘 수집",    bg: "bg-[#008F7A]/10", text: "text-[#008F7A]" },
];

function PlaceholderSection({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2]/10 to-[#008F7A]/10">
        <Icon className="h-8 w-8 text-[#845EC2]" />
      </div>
      <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-neutral-400">{description}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState<TabKey>("Schedule");
  const [filesTab, setFilesTab] = useState<FilesTabKey>("Board");
  const [interestsTab, setInterestsTab] = useState<InterestsTabKey>("Hobbies");
  const [stockTab, setStockTab] = useState<StockTabKey>("MyPortfolio");

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const activeItem = NAV_ITEMS.find((n) => n.key === active)!;

  return (
    <>
      {/* ── Dashboard Nav ── */}
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
            {NAV_ITEMS.map((item) => {
              const cls = cn(
                "shrink-0 text-[11px] font-medium tracking-wide transition-colors",
                active === item.key
                  ? "text-[#845EC2]"
                  : cn("text-neutral-400", item.hoverClass),
              );
              return "href" in item ? (
                <Link key={item.key} href={(item as any).href} className={cls}>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActive(item.key as TabKey)}
                  className={cls}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Login */}
          <AuthLoginButton className="shrink-0 rounded-none border-0 bg-transparent px-0 py-0 text-[11px] font-medium tracking-wide text-neutral-400 shadow-none hover:bg-transparent hover:text-[#845EC2]" />
        </div>
      </header>

      {/* Covers the global SiteNav category sub-bar */}
      <div className="fixed inset-x-0 top-11 z-[55] h-10 bg-white" />

      {/* ── Main content ── */}
      <main className="min-h-screen bg-white pt-[84px]">

        {/* Hero */}
        <section className="border-b border-neutral-100 py-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">{dateStr}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 lg:text-5xl">
            Hello, Another Day!
          </h1>
          <p className="mt-3 text-base text-[#0089BA]">
            Inspired by AI bona fide
          </p>

          {/* CTA buttons */}
          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActive("Schedule")}
              className="rounded-full bg-gradient-to-r from-[#845EC2] to-[#0081CF] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"
            >
              오늘 일정 보기
            </button>
            <button
              type="button"
              onClick={() => setActive("News")}
              className="rounded-full border border-[#008E9B] px-6 py-2 text-sm font-medium text-[#008E9B] transition-colors hover:bg-[#008E9B]/5"
            >
              뉴스 확인
            </button>
          </div>
        </section>

        {/* Quick stats */}
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {QUICK_STATS.map((stat) => (
              <div key={stat.label} className={cn("rounded-2xl p-5", stat.bg)}>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className={cn("mt-1 text-2xl font-semibold", stat.text)}>
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Active tab content */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          {/* Section header */}
          <div className="mb-6 flex items-center gap-2 border-b border-neutral-100 pb-4">
            <activeItem.icon className="h-5 w-5 text-[#845EC2]" />
            <h2 className="text-sm font-semibold text-neutral-700">{activeItem.label}</h2>
          </div>

          {/* Tab panels */}
          {active === "Schedule" && (
            <div className="space-y-3">
              {[
                { time: "09:00", title: "팀 스탠드업 미팅", tag: "회의", tagBg: "bg-[#845EC2]/10", tagText: "text-[#845EC2]" },
                { time: "13:00", title: "AI 모델 리뷰",     tag: "리뷰", tagBg: "bg-[#2C73D2]/10", tagText: "text-[#2C73D2]" },
                { time: "16:30", title: "주간 보고서 작성", tag: "업무", tagBg: "bg-[#0089BA]/10", tagText: "text-[#0089BA]" },
              ].map((ev) => (
                <div key={ev.title} className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                  <span className="w-12 shrink-0 text-sm font-medium text-neutral-400">{ev.time}</span>
                  <span className="flex-1 text-sm font-medium text-neutral-800">{ev.title}</span>
                  <span className={cn("rounded-full px-3 py-0.5 text-[11px] font-medium", ev.tagBg, ev.tagText)}>
                    {ev.tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {active === "Todo" && (
            <div className="space-y-3">
              {[
                { done: true,  text: "Gemini API 연동 완료" },
                { done: false, text: "대시보드 UI 개선" },
                { done: false, text: "RAG 파이프라인 테스트" },
                { done: false, text: "주간 리포트 초안 작성" },
                { done: true,  text: "코드 리뷰 완료" },
              ].map((item) => (
                <div key={item.text} className={cn(
                  "flex items-center gap-3 rounded-2xl border px-5 py-4",
                  item.done ? "border-neutral-100 bg-neutral-50 opacity-50" : "border-neutral-200 bg-white",
                )}>
                  <div className={cn(
                    "h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                    item.done ? "border-[#008F7A] bg-[#008F7A]" : "border-neutral-300",
                  )}>
                    {item.done && <span className="text-[8px] text-white">✓</span>}
                  </div>
                  <span className={cn("text-sm", item.done ? "line-through text-neutral-400" : "text-neutral-800")}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {active === "Finance" && (
            <PlaceholderSection icon={TrendingUp} title="Finance" description="수입·지출 현황과 예산 분석을 한 눈에 확인하세요." />
          )}

          {active === "MyStock" && (
            <div className="flex gap-6">
              {/* Sidebar */}
              <aside className="w-48 shrink-0">
                <nav className="flex flex-col gap-1">
                  {MYSTOCK_SIDEBAR.map(({ key, label, icon: Icon, activeText, activeBg }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStockTab(key)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left",
                        stockTab === key
                          ? cn(activeBg, activeText)
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                  <hr className="my-2 border-neutral-100" />
                  {MYSTOCK_ANALYSIS.map(({ key, label, icon: Icon, activeText, activeBg }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStockTab(key)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left",
                        stockTab === key
                          ? cn(activeBg, activeText)
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {stockTab === "MyPortfolio" && (
                  <div className="space-y-3">
                    {[
                      { name: "삼성전자", ticker: "005930", price: "74,200", change: "+1.50%", up: true },
                      { name: "카카오",   ticker: "035720", price: "41,350", change: "-0.84%", up: false },
                      { name: "NVIDIA",   ticker: "NVDA",   price: "$892",   change: "+3.21%", up: true },
                      { name: "애플",     ticker: "AAPL",   price: "$189",   change: "+0.62%", up: true },
                    ].map((s) => (
                      <div key={s.ticker} className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-800">{s.name}</p>
                          <p className="text-[11px] text-neutral-400">{s.ticker}</p>
                        </div>
                        <span className="text-sm font-semibold text-neutral-800">{s.price}</span>
                        <span className={cn("min-w-[60px] text-right text-sm font-medium", s.up ? "text-[#008E9B]" : "text-red-500")}>
                          {s.change}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {stockTab === "Short" && (
                  <PlaceholderSection icon={TrendingDown} title="Short" description="숏 포지션 종목을 관리하세요." />
                )}
                {stockTab === "Long" && (
                  <PlaceholderSection icon={TrendingUp} title="Long" description="롱 포지션 종목을 관리하세요." />
                )}
                {stockTab === "Hold" && (
                  <PlaceholderSection icon={Timer} title="Hold" description="장기 보유 종목을 확인하세요." />
                )}
                {stockTab === "SamsungAnalysis" && (
                  <PlaceholderSection icon={Building2} title="삼성전자 분석" description="삼성전자 종목 분석 리포트를 확인하세요." />
                )}
              </div>
            </div>
          )}

          {active === "MyAssets" && (
            <PlaceholderSection icon={PieChart} title="My Assets" description="보유 자산을 카테고리별로 정리하고 추이를 확인하세요." />
          )}

          {active === "News" && (
            <div className="space-y-4">
              {[
                { source: "매일경제",   title: "AI 반도체 수출 규제 완화 논의 본격화", time: "1시간 전" },
                { source: "한국경제",   title: "코스피 2,700선 돌파…외국인 순매수 지속", time: "2시간 전" },
                { source: "테크크런치", title: "OpenAI, 새로운 멀티모달 모델 발표 예정",  time: "3시간 전" },
                { source: "블룸버그",   title: "Fed 금리 동결 전망 강화, 달러 약세",      time: "5시간 전" },
              ].map((n) => (
                <div key={n.title} className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0089BA]">{n.source}</span>
                    <span className="text-[10px] text-neutral-300">·</span>
                    <span className="text-[10px] text-neutral-400">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-800">{n.title}</p>
                </div>
              ))}
            </div>
          )}

          {active === "Scrap" && (
            <div className="flex gap-6">
              {/* Sidebar */}
              <aside className="w-48 shrink-0">
                <nav className="flex flex-col gap-1">
                  {FILES_SIDEBAR.map(({ key, label, icon: Icon, activeText, activeBg }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilesTab(key)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left",
                        filesTab === key
                          ? cn(activeBg, activeText)
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {filesTab === "Board" && <FilesBoard />}
                {filesTab === "List" && <FilesPostList />}
                {filesTab === "MyDocuments" && (
                  <PlaceholderSection icon={FolderOpen} title="My Documents" description="내 문서를 한 곳에서 관리하세요." />
                )}
                {filesTab === "MyTables" && (
                  <PlaceholderSection icon={Table2} title="My Tables" description="테이블 형태의 데이터를 관리하세요." />
                )}
                {filesTab === "MyScraps" && (
                  <PlaceholderSection icon={Bookmark} title="My Scraps" description="스크랩한 아티클과 링크를 모아보세요." />
                )}
              </div>
            </div>
          )}

          {active === "Interests" && (
            <div className="flex gap-6">
              {/* Sidebar */}
              <aside className="w-48 shrink-0">
                <nav className="flex flex-col gap-1">
                  {INTERESTS_SIDEBAR.map(({ key, label, icon: Icon, activeText, activeBg }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setInterestsTab(key)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left",
                        interestsTab === key
                          ? cn(activeBg, activeText)
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {interestsTab === "Hobbies" && (
                  <PlaceholderSection icon={Heart} title="Hobbies" description="나의 취미와 관심사를 기록하고 관리하세요." />
                )}
                {interestsTab === "Items" && (
                  <PlaceholderSection icon={Package} title="Items" description="관심 있는 아이템과 제품을 모아보세요." />
                )}
                {interestsTab === "Travel" && (
                  <PlaceholderSection icon={Plane} title="Travel" description="여행 계획과 가고 싶은 곳을 정리하세요." />
                )}
                {interestsTab === "Shopping" && (
                  <PlaceholderSection icon={ShoppingCart} title="Shopping" description="쇼핑 목록과 위시리스트를 관리하세요." />
                )}
              </div>
            </div>
          )}

          {active === "Research" && (
            <PlaceholderSection icon={Search} title="Research" description="리서치 자료와 인사이트를 체계적으로 정리하세요." />
          )}

          {active === "Reports" && (
            <PlaceholderSection icon={FileText} title="Reports" description="생성된 보고서와 분석 결과를 확인하세요." />
          )}

          {active === "Memo" && (
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#845EC2] to-[#0081CF]">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">AI Assistant</p>
                  <p className="text-xs text-neutral-400">무엇이든 물어보세요</p>
                </div>
              </div>
              <GeminiHeroChat className="w-full max-w-full" />
            </div>
          )}
        </section>

        {/* AI Assistant — always visible at bottom */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#845EC2]" />
            <h2 className="text-sm font-semibold text-neutral-700">AI Assistant</h2>
          </div>
          <DashboardAssistant />
        </section>
      </main>
    </>
  );
}
