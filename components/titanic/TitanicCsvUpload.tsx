"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

const EXPECTED = "titanic.csv";

function validateTitanicCsv(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return "CSV 파일만 업로드할 수 있습니다.";
  }
  if (file.name.toLowerCase() !== EXPECTED) {
    return `파일 이름은 ${EXPECTED} 이어야 합니다.`;
  }
  return null;
}

export function TitanicCsvUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  const applyFile = useCallback((file: File | undefined) => {
    if (!file) return;
    const err = validateTitanicCsv(file);
    if (err) {
      setMessage({ type: "err", text: err });
      setLastFile(null);
      return;
    }
    setLastFile(file);
    setMessage({
      type: "ok",
      text: `${file.name} (${(file.size / 1024).toFixed(1)} KB) 업로드가 완료되었습니다.`,
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      applyFile(file);
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

  const openPicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-label="titanic.csv 파일 선택"
        onChange={(e) => {
          applyFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {/* 업로드 창: 드래그 앤 드롭 */}
      <div
        role="region"
        aria-label="titanic.csv 드래그 앤 드롭 업로드 영역"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={[
          "flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-colors",
          isDragging
            ? "border-sky-500 bg-sky-50"
            : "border-slate-300 bg-slate-50",
        ].join(" ")}
      >
        <FileSpreadsheet
          className="h-12 w-12 text-slate-400"
          strokeWidth={1.25}
          aria-hidden
        />
        <p className="text-center text-sm font-medium text-slate-700">
          <span className="font-semibold text-slate-900">{EXPECTED}</span>를
          이 영역에 끌어다 놓으세요
        </p>
        <p className="text-center text-xs text-slate-500">
          드롭하면 바로 업로드 처리됩니다.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400">또는</span>
        </div>
      </div>

      {/* 업로드 버튼: 파일 선택 후 동일 검증·처리 */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <Upload className="h-4 w-4" aria-hidden />
          업로드
        </button>
        <p className="text-center text-xs text-slate-500">
          클릭하면 탐색기가 열리고, {EXPECTED}를 선택하면 업로드됩니다.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className={
            message.type === "ok"
              ? "rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800"
              : "rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-800"
          }
        >
          {message.text}
        </p>
      )}

      {lastFile && (
        <p className="text-center text-xs text-slate-400">
          마지막 파일: {lastFile.name} · {(lastFile.size / 1024).toFixed(1)} KB
        </p>
      )}
    </div>
  );
}
