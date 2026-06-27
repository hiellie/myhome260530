import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "http://localhost:5678/webhook/send-mail";

export async function POST(req: NextRequest) {
  let body: { to?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { to, subject, message } = body;
  if (!to || !subject || !message) {
    return NextResponse.json({ error: "받는 사람, 제목, 내용을 모두 입력해주세요." }, { status: 400 });
  }

  const upstream = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, body: message }),
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: "메일 전송에 실패했습니다." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
