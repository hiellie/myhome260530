import { AuthPanel } from "@/components/auth/AuthPanel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-bold text-slate-900">
          RAG<span className="text-sky-600">WATSON</span>
        </h1>
        <AuthPanel />
      </div>
    </div>
  );
}
