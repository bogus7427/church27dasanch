import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** 요청한 사람이 관리자인지 확인 (브라우저에서 보낸 로그인 토큰으로) */
async function requireAdmin(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data } = await supabaseAdmin.auth.getUser(token);
  if (!data.user) return null;
  const { data: p } = await supabaseAdmin.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  return p?.role === "admin" ? data.user : null;
}

/** 회원 탈퇴 처리 (로그인 계정까지 완전히 삭제) — 관리자만 */
export async function DELETE(req: Request) {
  let me;
  try {
    me = await requireAdmin(req);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  if (!me) return NextResponse.json({ error: "관리자만 할 수 있습니다." }, { status: 403 });

  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "회원 id 가 없습니다." }, { status: 400 });
  if (id === me.id) return NextResponse.json({ error: "본인 계정은 여기서 삭제할 수 없습니다." }, { status: 400 });

  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(id); // profiles·댓글은 연결되어 함께 삭제됨
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
