import { NextRequest, NextResponse } from "next/server";

const MODEL_IDS: Record<string, string> = {
  fast: "gemini-2.5-flash",
  pro: "gemini-1.5-pro",
};

type ChatMessage = { role: "user" | "assistant"; text: string };

function extractGeminiError(raw: string, parsed: unknown) {
  if (typeof parsed === "object" && parsed !== null) {
    const body = parsed as Record<string, unknown>;
    const apiError = body.error ?? body.message;
    if (typeof apiError === "string") return apiError;
    if (typeof apiError === "object" && apiError !== null) {
      const errObj = apiError as Record<string, unknown>;
      if (typeof errObj.message === "string") return errObj.message;
      if (typeof errObj.status === "string") {
        return `${String(errObj.message ?? "Gemini API 오류")} (${errObj.status})`;
      }
      if (Array.isArray(errObj.details) && errObj.details.length > 0) {
        const firstDetail = errObj.details[0];
        if (
          typeof firstDetail === "object" &&
          firstDetail !== null &&
          "description" in firstDetail &&
          typeof (firstDetail as any).description === "string"
        ) {
          return (firstDetail as any).description;
        }
      }
    }
  }
  return raw || "Gemini API 오류";
}

function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.text }],
  }));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 GEMINI_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[]; modelKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const messages = body.messages?.filter((m) => m.text?.trim()) ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "메시지가 비어 있습니다." }, { status: 400 });
  }

  const modelId = MODEL_IDS[body.modelKey ?? "fast"] ?? MODEL_IDS.fast;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  const upstream = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: toGeminiContents(messages),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  const raw = await upstream.text();
  let upstreamData: unknown;
  try {
    upstreamData = JSON.parse(raw);
  } catch {
    upstreamData = undefined;
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: extractGeminiError(raw, upstreamData) },
      { status: upstream.status >= 400 ? upstream.status : 502 }
    );
  }

  let data: {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
    error?: { message?: string };
  };
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Gemini 응답을 해석할 수 없습니다." }, { status: 502 });
  }

  if (data.error?.message) {
    return NextResponse.json({ error: data.error.message }, { status: 502 });
  }

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("") ?? "";

  if (!text) {
    const reason = data.candidates?.[0]?.finishReason;
    return NextResponse.json(
      {
        error: reason
          ? `응답이 비어 있습니다 (finishReason: ${reason}).`
          : "응답이 비어 있습니다.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ text });
}
