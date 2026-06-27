"use client";

import { FileSpreadsheet, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

function validateCsv(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return "CSV 파일만 업로드할 수 있습니다.";
  }
  return null;
}

export function LessonDataCollectionUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  const applyFile = useCallback((file: File | undefined) => {
    if (!file) return;
    const err = validateCsv(file);
    if (err) {
      setMessage({ type: "err", text: err });
      setLastFile(null);
      return;
    }
    setLastFile(file);
    setMessage({
      type: "ok",
      text: `${file.name} (${(file.size / 1024).toFixed(1)} KB) 파일이 선택되었습니다. Neon DB 적재는 다음 단계에서 연결합니다.`,
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      applyFile(e.dataTransfer.files?.[0]);
    },
    [applyFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="mt-8 w-full max-w-xl space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-label="캐글 Titanic CSV 파일 선택"
        onChange={(e) => {
          applyFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div
        role="region"
        aria-label="CSV 드래그 앤 드롭 업로드 영역"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={[
          "flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
          isDragging
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-200 bg-neutral-50/50",
        ].join(" ")}
      >
        <FileSpreadsheet
          className="h-11 w-11 text-neutral-400"
          strokeWidth={1.25}
          aria-hidden
        />
        <p className="text-center text-sm text-neutral-700">
          캐글에서 받은 Titanic CSV를 이 영역에 끌어다 놓으세요
        </p>
        <p className="text-center text-xs text-neutral-500">
          예: train.csv, test.csv, Titanic-Dataset.csv
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
          <span className="bg-white px-3 text-neutral-400">또는</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-none border border-neutral-900 bg-neutral-900 px-8 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-80"
        >
          <Upload className="h-4 w-4" aria-hidden />
          파일 선택
        </button>
        <p className="text-center text-xs text-neutral-500">
          클릭하여 로컬 CSV 파일을 선택합니다.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className={
            message.type === "ok"
              ? "rounded-sm bg-neutral-100 px-4 py-3 text-sm text-neutral-800"
              : "rounded-sm bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {message.text}
        </p>
      )}

      {lastFile && (
        <p className="text-center text-xs text-neutral-400">
          선택된 파일: {lastFile.name} · {(lastFile.size / 1024).toFixed(1)} KB
        </p>
      )}
    </div>
  );
}
