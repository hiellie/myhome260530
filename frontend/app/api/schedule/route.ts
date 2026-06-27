import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  process.env.N8N_SCHEDULE_WEBHOOK_URL ||
  "http://localhost:5678/webhook/schedule";

export async function POST(req: NextRequest) {
  let body: {
    title?: string;
    startDateTime?: string;
    endDateTime?: string;
    description?: string;
    location?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { title, startDateTime, endDateTime } = body;
  if (!title || !startDateTime || !endDateTime) {
    return NextResponse.json({ error: "제목, 시작/종료 시간은 필수입니다." }, { status: 400 });
  }

  const upstream = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: "캘린더 등록에 실패했습니다." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
