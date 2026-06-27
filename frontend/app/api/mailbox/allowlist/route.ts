import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS allowed_senders (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`SELECT id, email, name, created_at FROM allowed_senders ORDER BY created_at DESC`;
    return NextResponse.json({ ok: true, senders: rows });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { email, name } = await req.json();
    if (!email?.trim()) return NextResponse.json({ ok: false, error: "이메일을 입력하세요." }, { status: 400 });
    const rows = await sql`
      INSERT INTO allowed_senders (email, name)
      VALUES (${email.trim().toLowerCase()}, ${name?.trim() || ''})
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, email, name, created_at
    `;
    return NextResponse.json({ ok: true, sender: rows[0] });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id가 필요합니다." }, { status: 400 });
    await sql`DELETE FROM allowed_senders WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
