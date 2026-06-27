import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS allowed_senders (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS received_emails (
      id SERIAL PRIMARY KEY,
      from_email TEXT NOT NULL,
      from_name TEXT DEFAULT '',
      subject TEXT DEFAULT '',
      body TEXT DEFAULT '',
      received_at TIMESTAMPTZ DEFAULT NOW(),
      summary TEXT DEFAULT '',
      is_read BOOLEAN DEFAULT FALSE
    )
  `;
}

export async function POST(req: NextRequest) {
  try {
    await ensureTables();

    const { from, fromName, subject, body } = await req.json();
    if (!from) return NextResponse.json({ ok: false, error: "발신자가 없습니다." }, { status: 400 });

    const fromEmail = from.trim().toLowerCase();

    // 허용 목록 조회
    const senders = await sql`SELECT email FROM allowed_senders`;
    const allowedList = senders.map((r: { email: string }) => r.email);

    if (allowedList.length === 0) {
      return NextResponse.json({ ok: false, allowed: false, reason: "허용 목록이 비어 있습니다." });
    }

    // Gemini로 필터링 + 요약
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false, error: "GEMINI_API_KEY 없음" }, { status: 500 });

    const prompt = `허용된 이메일 목록: ${allowedList.join(", ")}

발신자: ${fromEmail}
제목: ${subject || "(제목 없음)"}
내용: ${(body || "").slice(0, 1000)}

위 발신자가 허용 목록에 있는지 확인하고, 이메일 내용을 2~3문장으로 요약해줘.
반드시 아래 JSON 형식으로만 응답해. 다른 텍스트는 절대 포함하지 마.
{"allowed":true,"summary":"요약문"}
또는
{"allowed":false,"summary":""}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      }
    );

    const geminiData = await geminiRes.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{"allowed":false,"summary":""}';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const { allowed, summary } = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { allowed: false, summary: "" };

    if (!allowed) {
      return NextResponse.json({ ok: true, allowed: false, reason: "허용되지 않은 발신자" });
    }

    // DB 저장
    await sql`
      INSERT INTO received_emails (from_email, from_name, subject, body, summary)
      VALUES (${fromEmail}, ${fromName || ''}, ${subject || ''}, ${body || ''}, ${summary || ''})
    `;

    return NextResponse.json({ ok: true, allowed: true, summary });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
