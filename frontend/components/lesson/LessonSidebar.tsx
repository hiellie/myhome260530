"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const titanicHref = "/lesson/titanic";
const dataCollectionHref = "/lesson/titanic/data-collection";

const linkClass =
  "block py-2.5 text-sm tracking-[0.06em] text-neutral-600 transition-colors hover:text-neutral-900";

const subLinkClass =
  "block py-2 pl-3 text-sm tracking-[0.04em] text-neutral-500 transition-colors hover:text-neutral-900";

export function LessonSidebar() {
  const pathname = usePathname();
  const isTitanicSection = pathname.startsWith(titanicHref);
  const [titanicOpen, setTitanicOpen] = useState(isTitanicSection);

  useEffect(() => {
    if (isTitanicSection) {
      setTitanicOpen(true);
    }
  }, [isTitanicSection]);

  const isTitanicOverview = pathname === titanicHref;
  const isDataCollection = pathname === dataCollectionHref;

  return (
    <aside className="w-52 shrink-0 border-r border-neutral-100 py-12 pl-6 pr-3">
      <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
        수업용
      </p>
      <nav aria-label="수업용 사이드 메뉴">
        <ul>
          <li>
            <div className="flex items-center justify-between gap-1">
              <Link
                href={titanicHref}
                className={
                  isTitanicOverview
                    ? `${linkClass} font-medium text-neutral-900`
                    : linkClass
                }
                aria-current={isTitanicOverview ? "page" : undefined}
              >
                타이타닉
              </Link>
              <button
                type="button"
                onClick={() => setTitanicOpen((open) => !open)}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
                aria-expanded={titanicOpen}
                aria-controls="lesson-titanic-submenu"
                aria-label={titanicOpen ? "타이타닉 하위 메뉴 접기" : "타이타닉 하위 메뉴 펼치기"}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${titanicOpen ? "rotate-90" : ""}`}
                  aria-hidden
                />
              </button>
            </div>
            {titanicOpen && (
              <ul id="lesson-titanic-submenu" className="mt-0.5 border-l border-neutral-100">
                <li>
                  <Link
                    href={dataCollectionHref}
                    className={
                      isDataCollection
                        ? `${subLinkClass} font-medium text-neutral-900`
                        : subLinkClass
                    }
                    aria-current={isDataCollection ? "page" : undefined}
                  >
                    1. 데이터 수집
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}
