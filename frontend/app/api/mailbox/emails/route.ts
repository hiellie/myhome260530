import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function ensureTable() {
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

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT id, from_email, from_name, subject, body, received_at, summary, is_read
      FROM received_emails
      ORDER BY received_at DESC
    `;
    return NextResponse.json({ ok: true, emails: rows });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "id가 필요합니다." }, { status: 400 });
    await sql`UPDATE received_emails SET is_read = TRUE WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id가 필요합니다." }, { status: 400 });
    await sql`DELETE FROM received_emails WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
