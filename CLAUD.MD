# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

CREATE TABLE posts (
    -- 1. 게시글 고유 식별자 (자동 증가 ID 또는 UUID)
    id SERIAL PRIMARY KEY,
    
    -- 2. 제목 (필수 입력)
    title VARCHAR(255) NOT NULL,
    
    -- 3. 작성자 (선택 입력이므로 NULL 허용)
    author VARCHAR(100),
    
    -- 4. 내용 (필수 입력, 길이에 제한이 없는 TEXT 타입)
    content TEXT NOT NULL,
    
    -- 5. Vercel Blob 파일 URL 저장 (파일이 없을 수 있으므로 NULL 허용)
    -- Vercel Blob에서 생성된 고유 다운로드 URL이 이 필드에 문자열로 저장됩니다.
    file_url TEXT,
    
    -- 6. 원본 파일 이름 저장 (사용자가 업로드한 실제 파일명 보관용, 선택)
    file_name VARCHAR(255),

    -- 7. 등록일 및 수정일 (자동 생성)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 데이터가 많아질 경우를 대비해 생성일 기준 정렬 조회를 위한 인덱스 추가 (선택)
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
