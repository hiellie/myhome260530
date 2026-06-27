import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
/* eslint-disable @next/next/no-img-element */
export default function Home() {
  return (
    /* Full-screen overlay: sits above the global SiteNav (z-50) */
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white px-6">
      {/* Wordmark */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[42px] font-light tracking-[0.12em] text-neutral-800 uppercase leading-none">
          Ellie
        </span>
        <span className="text-[42px] font-semibold tracking-[0.12em] uppercase leading-none bg-gradient-to-r from-[#845EC2] to-[#2C73D2] bg-clip-text text-transparent">
          Kim
        </span>
      </div>

      {/* Tagline */}
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#0089BA] mb-16">
        with AI bona fide
      </p>

      {/* Gradient divider */}
      <div className="w-px h-12 mb-16 bg-gradient-to-b from-[#845EC2] via-[#0081CF] to-[#008F7A]" />

      {/* Google Sign In */}
      <GoogleSignInButton />
    </div>
  );
}
