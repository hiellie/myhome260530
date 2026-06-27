"use client";

import { AuthPanel } from "@/components/auth/AuthPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthTab = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: AuthTab;
};

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[60] border-slate-200 sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>계정</DialogTitle>
          <DialogDescription>로그인 또는 회원가입</DialogDescription>
        </DialogHeader>
        <AuthPanel
          key={`${open}-${defaultTab}`}
          defaultTab={defaultTab}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
