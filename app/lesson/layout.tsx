import { LessonSidebar } from "@/components/lesson/LessonSidebar";

export default function LessonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="mx-auto flex w-full max-w-6xl">
        <LessonSidebar />
        <main className="min-w-0 flex-1 px-6 py-12">{children}</main>
      </div>
    </div>
  );
}
