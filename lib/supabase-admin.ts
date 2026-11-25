import "server-only"; // 실수로 브라우저 코드에서 불러오면 빌드 오류가 나도록 막음
import { createClient } from "@supabase/supabase-js";

/**
 * 관리자(Secret key) Supabase 연결 — 서버 컴포넌트 / Server Action / Route Handler 에서만 사용.
 * RLS(행 보안 정책)를 무시하고 모든 데이터를 읽고 쓸 수 있으니, 사용자 입력을 그대로 넣지 말 것.
 */
const url = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY 가 .env.local 에 없습니다.");
}

export const supabaseAdmin = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});
