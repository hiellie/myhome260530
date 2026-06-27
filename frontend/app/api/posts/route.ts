import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, author, content, file_name, file_url } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ ok: false, error: "제목을 입력하세요." }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO posts (title, author, content, file_name, file_url, created_at, updated_at)
      VALUES (${title.trim()}, ${author?.trim() || null}, ${content?.trim() || null}, ${file_name || null}, ${file_url || null}, NOW(), NOW())
      RETURNING id, title, author, created_at
    `;

    return NextResponse.json({ ok: true, post: result[0] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT id, title, author, content, file_name, file_url, created_at
      FROM posts
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ ok: true, posts: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
