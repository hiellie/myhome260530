import Image from "next/image";

import { GeminiHeroChat } from "@/components/GeminiHeroChat";

const curriculumTags = [
  "FastAPI",
  "RAG",
  "Multi-Agent",
  "LangChain",
  "Python",
  "실습 프로젝트",
  "엔터프라이즈 AI",
  "클린 아키텍처",
];

export function HomeHero() {
  return (
    <>
      {/* Mobile: Stüssy-style centered square + newsletter */}
      <section className="bg-white pt-14 lg:hidden">
        <div className="mx-auto w-full max-w-md px-4 pb-12">
          <div className="mx-auto aspect-square w-full max-w-sm border border-neutral-200 bg-neutral-50">
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <Image
                src="/partners/ibm-redhat.png"
                alt="IBM x Red Hat"
                width={200}
                height={36}
                className="h-7 w-auto opacity-90"
              />
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                작품 준비중입니다
              </p>
              <p className="text-lg font-bold leading-tight text-neutral-900">
                AI 서비스 개발
                <br />
                교육
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-neutral-200 pt-8">
            <GeminiHeroChat className="mx-auto" />
          </div>
        </div>
      </section>

      {/* Desktop: full hero */}
      <section className="relative hidden min-h-screen items-center justify-center bg-white pt-28 lg:flex lg:pt-32">
        <div className="mx-auto w-full max-w-lg px-4 py-16 text-center sm:max-w-xl sm:py-20 md:max-w-2xl">
          <div className="mb-8">
            <p className="mb-3 text-sm text-slate-600">
              글로벌 기업 IBM x Red Hat과 함께하는
            </p>
            <Image
              src="/partners/ibm-redhat.png"
              alt="IBM x Red Hat"
              width={280}
              height={48}
              className="mx-auto h-8 w-auto sm:h-10"
              priority
            />
          </div>

          <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 bg-clip-text text-transparent">
              AI 서비스 개발
            </span>
            <br />
            교육
          </h1>

          <div className="mx-auto mt-8 max-w-md space-y-1 text-base leading-relaxed text-slate-600 sm:text-lg">
            <p>K-Digital Training</p>
            <p>디지털 선도기업 아카데미</p>
            <p>[IBM x RedHat]</p>
            <p className="font-medium text-slate-900">
              AI Transformation - AX Academy
            </p>
          </div>

          <GeminiHeroChat className="mx-auto mt-10" />

          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {curriculumTags.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
