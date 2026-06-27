"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, CheckCircle2, AlertCircle, Loader2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ProcessStatus = "idle" | "uploading" | "summarizing" | "done" | "error";
type SubmitStatus = "idle" | "saving" | "success" | "error";

interface UploadedFile {
  name: string;
  url: string;
}

export function FilesBoard() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("idle");
  const [processError, setProcessError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setProcessError("PDF 파일만 첨부할 수 있습니다.");
      setProcessStatus("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setProcessError("파일 크기는 10MB 이하여야 합니다.");
      setProcessStatus("error");
      return;
    }

    setProcessStatus("uploading");
    setProcessError("");
    setUploadedFile(null);

    const formData = new FormData();
    formData.append("file", file);

    let uploadData: { ok: boolean; file_name?: string; file_url?: string; summary?: string; error?: string };
    try {
      setProcessStatus("summarizing");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      uploadData = await res.json();
    } catch {
      setProcessError("업로드 중 네트워크 오류가 발생했습니다.");
      setProcessStatus("error");
      return;
    }

    if (!uploadData.ok) {
      setProcessError(uploadData.error || "업로드 실패");
      setProcessStatus("error");
      return;
    }

    setUploadedFile({ name: uploadData.file_name!, url: uploadData.file_url! });
    if (uploadData.summary) setContent(uploadData.summary);
    setProcessStatus("done");
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const removeFile = () => {
    setUploadedFile(null);
    setProcessStatus("idle");
    setProcessError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setSubmitError("제목을 입력하세요.");
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("saving");
    setSubmitError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          content,
          file_name: uploadedFile?.name ?? null,
          file_url: uploadedFile?.url ?? null,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "저장에 실패했습니다.");

      setSubmitStatus("success");
      setTitle("");
      setAuthor("");
      setContent("");
      setUploadedFile(null);
      setProcessStatus("idle");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSubmitStatus("error");
    }
  };

  const formatSize = (url: string) => url; // URL은 표시용으로만

  const isProcessing = processStatus === "uploading" || processStatus === "summarizing";

  const processLabel =
    processStatus === "uploading"   ? "업로드 중..." :
    processStatus === "summarizing" ? "AI 요약 중..." : "";

  return (
    <div className="space-y-5">
      {/* 제목 */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">제목</label>
        <div className="relative">
          <input
            type="text"
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-300 focus:border-[#845EC2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#845EC2]/20 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-300 select-none">
            {title.length}/200
          </span>
        </div>
      </div>

      {/* 작성자 */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">작성자</label>
        <div className="relative">
          <input
            type="text"
            maxLength={100}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자를 입력하세요"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-300 focus:border-[#2C73D2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C73D2]/20 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-300 select-none">
            {author.length}/100
          </span>
        </div>
      </div>

      {/* 내용 */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">내용</label>
          {processStatus === "done" && (
            <span className="flex items-center gap-1 rounded-full bg-[#845EC2]/10 px-2 py-0.5 text-[10px] font-medium text-[#845EC2]">
              <Sparkles className="h-2.5 w-2.5" />
              AI 자동 요약
            </span>
          )}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isProcessing ? "AI가 내용을 요약하는 중입니다..." : "내용을 입력하세요"}
          rows={8}
          disabled={isProcessing}
          className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-300 focus:border-[#008E9B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008E9B]/20 transition-all leading-relaxed disabled:opacity-50"
        />
      </div>

      {/* 파일 첨부 */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">파일 첨부</label>

        {/* Drop zone */}
        {!uploadedFile && !isProcessing && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 transition-all",
              isDragging
                ? "border-[#845EC2] bg-[#845EC2]/5"
                : "border-neutral-200 bg-neutral-50 hover:border-[#845EC2]/40 hover:bg-[#845EC2]/5",
              processStatus === "error" && "border-red-200 bg-red-50",
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              isDragging ? "bg-[#845EC2]/15" : "bg-neutral-100",
              processStatus === "error" && "bg-red-100",
            )}>
              <Upload className={cn(
                "h-5 w-5 transition-colors",
                isDragging ? "text-[#845EC2]" : "text-neutral-400",
                processStatus === "error" && "text-red-400",
              )} />
            </div>
            {processStatus === "error" ? (
              <p className="text-sm font-medium text-red-400">{processError}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-neutral-500">
                  {isDragging ? "PDF를 여기에 놓으세요" : "PDF를 드래그하거나 클릭하여 업로드"}
                </p>
                <p className="text-[11px] text-neutral-300">PDF 파일만 지원 · 최대 10MB</p>
              </>
            )}
          </div>
        )}

        {/* Processing state */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-[#845EC2]/20 bg-[#845EC2]/5 px-6 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[#845EC2]" />
            <span className="text-sm font-medium text-[#845EC2]">{processLabel}</span>
          </div>
        )}

        {/* Uploaded file card */}
        {uploadedFile && !isProcessing && (
          <div className="flex items-center gap-3 rounded-xl border border-[#845EC2]/20 bg-[#845EC2]/5 px-4 py-3">
            <FileText className="h-5 w-5 shrink-0 text-[#845EC2]" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-neutral-700">{uploadedFile.name}</p>
              {processStatus === "done" && (
                <div className="mt-0.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#845EC2]" />
                  <span className="text-[11px] text-[#845EC2]">AI 요약 완료</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="shrink-0 rounded-full p-1 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {submitStatus === "success" && (
            <>
              <CheckCircle2 className="h-4 w-4 text-[#008F7A]" />
              <span className="text-sm text-[#008F7A]">저장되었습니다.</span>
            </>
          )}
          {submitStatus === "error" && (
            <>
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">{submitError}</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitStatus === "saving" || isProcessing}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#845EC2] to-[#2C73D2] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {submitStatus === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          등록
        </button>
      </div>
    </div>
  );
}
