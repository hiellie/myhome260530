"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

type AuthLoginButtonProps = {
  className?: string;
};

export function AuthLoginButton({ className }: AuthLoginButtonProps) {
  const { data: session } = useSession();

  const buttonClass = cn(
    "rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 sm:px-4 sm:text-sm",
    className,
  );

  if (session) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className={buttonClass}
      >
        Logout
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className={buttonClass}
    >
      Login
    </button>
  );
}
