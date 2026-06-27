import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash";

async function summarizePdf(base64: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64,
              },
            },
            {
              text: `이 문서에서 "II. 사업의 내용" 섹션을 찾아 핵심 내용을 3~5문장으로 한국어로 요약해줘.
섹션이 없으면 문서 전체를 3~5문장으로 요약해줘.
요약문만 출력하고 제목이나 머리말은 붙이지 마.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";

  if (!text) throw new Error("Gemini 요약 실패");
  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "파일이 없습니다." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ ok: false, error: "PDF 파일만 업로드할 수 있습니다." }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
    const pathname = `posts/${timestamp}_${safeName}`;

    // Blob 업로드 + Gemini 요약 병렬 실행
    const [blob, summary] = await Promise.all([
      put(pathname, buffer, {
        access: "public",
        contentType: "application/pdf",
      }),
      process.env.GEMINI_API_KEY
        ? summarizePdf(base64, process.env.GEMINI_API_KEY).catch(() => "")
        : Promise.resolve(""),
    ]);

    return NextResponse.json({
      ok: true,
      file_name: file.name,
      file_url: blob.url,
      summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "업로드 실패";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
