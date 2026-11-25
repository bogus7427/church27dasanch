import { createClient } from "@supabase/supabase-js";

// 환경변수가 빠져도 빌드가 멈추지 않도록 자리표시 값 사용 (그 경우 데이터는 비어 보이고 콘솔에 오류가 찍힘)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing-env.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-env";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 없습니다.");
}

export const supabase = createClient(url, anonKey);
