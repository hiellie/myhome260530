export type PortfolioItemData = {
  id: string;
  title: string;
  tag: string;
  featured?: boolean;
};

export const portfolioCategories = [
  "ALL",
  "RAG SYSTEM",
  "ARCHITECTURE",
  "AGENT",
  "BACKEND",
  "MOBILE",
  "DEVOPS",
  "NLP",
] as const;

export const portfolioItems: PortfolioItemData[] = [
  { id: "1", title: "대형 제조사 통합 문서 RAG 구축", tag: "RAG SYSTEM" },
  { id: "2", title: "핀테크 스타트업 AI 에이전트 설계", tag: "AGENT" },
  { id: "3", title: "헥사고날 DDD 기반 RAG 플랫폼 아키텍처", tag: "ARCHITECTURE", featured: true },
  { id: "4", title: "FastAPI 기반 AI 서비스 엔진 구현", tag: "BACKEND" },
  { id: "5", title: "Flutter 모바일 에이전트 UI 구현", tag: "MOBILE" },
  { id: "6", title: "Vercel + AWS 엔터프라이즈 배포 최적화", tag: "DEVOPS" },
  { id: "7", title: "의료 기관 비정형 문서 처리 파이프라인", tag: "RAG SYSTEM" },
  { id: "8", title: "물류 회사 Multi-Agent 시스템 구축", tag: "AGENT" },
];
