"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { AuthLoginButton } from "@/components/auth/AuthLoginButton";
import { portfolioCategories } from "@/components/home/portfolio-data";

type MobileMenuProps = {
  onClose: () => void;
  shopOpen: boolean;
  onToggleShop: () => void;
};

const secondaryLinks = [
  { href: "/#services", label: "교육개요" },
  { href: "/notice", label: "FAQ" },
  { href: "/titanic", label: "Lab" },
] as const;

export function MobileMenu({ onClose, shopOpen, onToggleShop }: MobileMenuProps) {
  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto px-4 pb-8">
      <nav className="border-b border-neutral-200 py-4" aria-label="모바일 주 메뉴">
        <button
          type="button"
          onClick={onToggleShop}
          className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900"
        >
          교육과정
          {shopOpen ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
        </button>

        {shopOpen && (
          <ul className="space-y-0 border-t border-neutral-100">
            {portfolioCategories.map((category) => (
              <li key={category}>
                <a
                  href="/#portfolio"
                  onClick={onClose}
                  className="block py-3.5 text-sm uppercase tracking-[0.1em] text-neutral-700"
                >
                  {category}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/lesson"
                onClick={onClose}
                className="block py-3.5 text-sm uppercase tracking-[0.1em] text-neutral-700"
              >
                수업용
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <ul className="divide-y divide-neutral-200">
        {secondaryLinks.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("/#") ? (
              <a
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
        <li className="py-4">
          <AuthLoginButton
            className="w-full justify-start rounded-none border-0 bg-transparent p-0 text-left text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900 shadow-none hover:bg-transparent"
          />
        </li>
      </ul>

      <div className="mt-auto border-t border-neutral-200 pt-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.1em] text-neutral-600">
          <span>문의: rex@ragtailor.com</span>
          <a
            href="mailto:rex@ragtailor.com"
            onClick={onClose}
            className="font-semibold text-neutral-900 underline underline-offset-2"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
