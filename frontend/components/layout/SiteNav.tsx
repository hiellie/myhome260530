"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AuthLoginButton } from "@/components/auth/AuthLoginButton";
import { portfolioCategories } from "@/components/home/portfolio-data";

import { MobileMenu } from "./MobileMenu";

const mainLinks = [
  { href: "/#portfolio", label: "교육과정", hasSub: true },
  { href: "/#services", label: "교육개요", hasSub: false },
  { href: "/notice", label: "FAQ", hasSub: true },
] as const;

const utilityClass =
  "text-[11px] uppercase tracking-[0.15em] text-neutral-900 transition-opacity hover:opacity-60";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-white">
        {/* Desktop */}
        <div className="mx-auto hidden w-full max-w-6xl px-6 lg:block">
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-neutral-900"
            >
              RAG<span className="text-sky-600">WATSON</span>
            </Link>

            <nav className="flex items-center gap-8" aria-label="주 메뉴">
              {mainLinks.map((link) =>
                link.href.startsWith("/#") ? (
                  <a key={link.href} href={link.href} className={utilityClass}>
                    {link.label}
                    {link.hasSub ? " ›" : ""}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={utilityClass}>
                    {link.label}
                    {link.hasSub ? " ›" : ""}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-6">
              <a href="mailto:rex@ragtailor.com" className={utilityClass}>
                Contact
              </a>
              <Link href="/titanic" className={utilityClass}>
                Lab
              </Link>
              <AuthLoginButton className="rounded-none border-0 bg-transparent px-0 py-0 text-[11px] font-normal uppercase tracking-[0.15em] text-neutral-900 shadow-none hover:bg-transparent hover:opacity-60" />
            </div>
          </div>

          <nav
            className="flex justify-center gap-6 border-t border-neutral-100 py-2.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500"
            aria-label="카테고리"
          >
            {portfolioCategories.map((category, index) => (
              <a
                key={category}
                href="/#portfolio"
                className={
                  index === 0
                    ? "text-neutral-900"
                    : "transition-colors hover:text-neutral-900"
                }
              >
                {category}
              </a>
            ))}
            <Link
              href="/lesson"
              className="transition-colors hover:text-neutral-900"
            >
              수업용
            </Link>
          </nav>
        </div>

        {/* Mobile top bar */}
        <div className="flex h-14 items-center justify-between px-4 lg:hidden">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-sm font-semibold tracking-tight text-neutral-900"
          >
            RAG<span className="text-sky-600">WATSON</span>
          </Link>

          <div className="flex items-center gap-5">
            <a href="mailto:rex@ragtailor.com" className={utilityClass}>
              Contact
            </a>
            {menuOpen ? (
              <button
                type="button"
                onClick={closeMenu}
                className={utilityClass}
                aria-expanded
                aria-controls="mobile-menu"
              >
                Close
              </button>
            ) : (
              <button
                type="button"
                onClick={openMenu}
                className={utilityClass}
                aria-expanded={false}
                aria-controls="mobile-menu"
              >
                Menu
              </button>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-white pt-14 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="모바일 메뉴"
        >
          <MobileMenu
            onClose={closeMenu}
            shopOpen={shopOpen}
            onToggleShop={() => setShopOpen((v) => !v)}
          />
        </div>
      )}
    </>
  );
}
