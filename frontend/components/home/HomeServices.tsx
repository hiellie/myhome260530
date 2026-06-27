const services = [
  {
    label: "시스템 구축",
    title: "데이터 최적화 RAG 구축",
    body: "AI 모델 성능과 비용 효율성을 모두 고려한 비정형 데이터 처리 파이프라인을 설계합니다. Agentic RAG부터 Multi-Agent까지 실전 중심으로 구현합니다.",
  },
  {
    label: "컨설팅",
    title: "프로젝트 참여 및 설계",
    body: "엔터프라이즈 성장에 맞춘 아키텍처 검증, 데이터 전략, 실행 로드맵을 함께 수립합니다. 헥사고날 클린 아키텍처 기반 DDD 설계를 적용합니다.",
  },
  {
    label: "교육",
    title: "AI 선도기업 전문 강의",
    body: "다중 에이전트 디자인, FastAPI / Flutter 통합, RAG 엔터프라이즈 구축 전문 강의를 제공합니다. AI 선도기업의 팀 역량을 실질적으로 높입니다.",
  },
];

const highlights = [
  "Agentic RAG Architecture",
  "Multi-Agent Orchestration",
  "Hexagonal Clean DDD",
  "FastAPI + Flutter + AWS",
];

export function HomeServices() {
  return (
    <section id="services" className="border-t border-neutral-100 bg-neutral-50/50 py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            교육 개요
          </p>
          <h2 className="mt-3 text-xl font-medium tracking-tight text-neutral-900 sm:text-2xl">
            AI 서비스 개발,
            <br />
            실무로 배웁니다
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            RAG·Multi-Agent·FastAPI 기반 AI 서비스 개발을 단계별로 학습하는
            실무 중심 교육 프로그램입니다.
          </p>
        </div>

        <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="bg-white p-6 sm:p-8"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                {service.label}
              </p>
              <h3 className="mt-3 text-sm font-medium text-neutral-900">
                {service.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                {service.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-px border border-t-0 border-neutral-200 bg-white p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            핵심 전문성
          </p>
          <h3 className="mt-3 text-sm font-medium text-neutral-900">
            자체 데이터 처리 최적화 RAG 시스템 구축
          </h3>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="border border-neutral-100 px-4 py-3 text-xs text-neutral-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
