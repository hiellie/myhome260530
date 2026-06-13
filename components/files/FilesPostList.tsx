"use client";

import { useEffect, useState } from "react";
import { RefreshCw, FileText, ChevronLeft, Paperclip, User, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: number;
  title: string;
  author: string | null;
  content: string | null;
  file_name: string | null;
  file_url: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

/* ── 상세 보기 ── */
function PostDetail({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        목록으로
      </button>

      {/* 제목 */}
      <div className="border-b border-neutral-100 pb-5">
        <h2 className="text-lg font-semibold text-neutral-900 leading-snug">{post.title}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {post.author || "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.created_at)}
          </span>
        </div>
      </div>

      {/* 본문 */}
      <div className="min-h-[120px] whitespace-pre-wrap text-sm text-neutral-700 leading-relaxed">
        {post.content || <span className="text-neutral-300">내용이 없습니다.</span>}
      </div>

      {/* 첨부 파일 */}
      {post.file_name && (
        <div className="border-t border-neutral-100 pt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">첨부 파일</p>
          {post.file_url ? (
            <a
              href={post.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-[#845EC2]/20 bg-[#845EC2]/5 px-4 py-2.5 text-sm font-medium text-[#845EC2] hover:bg-[#845EC2]/10 transition-colors"
            >
              <Paperclip className="h-4 w-4 shrink-0" />
              {post.file_name}
            </a>
          ) : (
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-500">
              <Paperclip className="h-4 w-4 shrink-0 text-neutral-400" />
              {post.file_name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 목록 ── */
export function FilesPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "불러오기 실패");
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  /* 상세 보기 중이면 detail 렌더 */
  if (selected) {
    return <PostDetail post={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">총 {posts.length}건</span>
        <button
          type="button"
          onClick={fetchPosts}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          새로고침
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-neutral-300">
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <FileText className="h-6 w-6 text-neutral-300" />
          </div>
          <p className="text-sm font-medium text-neutral-400">등록된 게시글이 없습니다.</p>
          <p className="mt-1 text-xs text-neutral-300">글쓰기에서 글을 작성해보세요.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && posts.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-neutral-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="w-12 px-4 py-3 text-center text-xs font-semibold text-neutral-400">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400">제목</th>
                <th className="w-28 px-4 py-3 text-center text-xs font-semibold text-neutral-400">작성자</th>
                <th className="w-36 px-4 py-3 text-center text-xs font-semibold text-neutral-400">작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr
                  key={post.id}
                  onClick={() => setSelected(post)}
                  className="cursor-pointer border-b border-neutral-50 transition-colors hover:bg-[#845EC2]/5 last:border-0"
                >
                  <td className="px-4 py-3.5 text-center text-xs text-neutral-300">
                    {posts.length - idx}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="truncate font-medium text-neutral-800">{post.title}</p>
                    {post.file_name && (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#0089BA]">
                        <Paperclip className="h-2.5 w-2.5" />
                        {post.file_name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-neutral-500">
                    {post.author || <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs text-neutral-400">
                    {formatDate(post.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
