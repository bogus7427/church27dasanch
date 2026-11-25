"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";

type Comment = { id: number; user_id: string; author_name: string | null; content: string; created_at: string };

/** 댓글: 누구나 읽기 · 로그인사용자/관리자 쓰기 · 본인 또는 관리자 삭제 (권한은 DB 에서도 한 번 더 검사) */
export default function Comments({ targetType, targetId }: { targetType: "news" | "sermon" | "video" | "photo" | "post"; targetId: string }) {
  const { user, canComment, isAdmin, role } = useProfile();
  const [list, setList] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("id,user_id,author_name,content,created_at")
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .order("created_at", { ascending: true });
    setList((data as Comment[]) ?? []);
  }, [targetType, targetId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("comments").insert({ target_type: targetType, target_id: targetId, content: text.trim() });
    setBusy(false);
    if (error) return setErr("댓글을 남기지 못했습니다. 권한을 확인해주세요.");
    setText("");
    load();
  }

  async function remove(id: number) {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    await supabase.from("comments").delete().eq("id", id);
    load();
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl text-navy">
        댓글 <span className="text-gold">{list.length}</span>
      </h3>

      <ul className="mt-4 space-y-3">
        {list.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <b className="text-navy">{c.author_name ?? "성도"}</b>
              <span className="flex items-center gap-3 text-navy/40">
                {c.created_at.slice(0, 16).replace("T", " ")}
                {(isAdmin || c.user_id === user?.id) && (
                  <button onClick={() => remove(c.id)} className="text-red-400 hover:text-red-600">
                    삭제
                  </button>
                )}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-navy/80">{c.content}</p>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-navy/40">첫 댓글을 남겨보세요.</li>}
      </ul>

      {canComment ? (
        <form onSubmit={submit} className="mt-5 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            placeholder="은혜 나눔, 응원의 한마디를 남겨주세요"
            className="flex-1 rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-navy"
          />
          <button disabled={busy || !text.trim()} className="btn rounded-xl bg-navy px-6 text-white disabled:opacity-40">
            등록
          </button>
        </form>
      ) : (
        <p className="mt-5 rounded-xl bg-cream px-5 py-4 text-sm text-navy/60">
          {user ? (
            <>현재 역할({role === "guest" ? "일반사용자" : role})은 읽기만 가능합니다.</>
          ) : (
            <>
              댓글은{" "}
              <Link href="/login" className="font-semibold text-navy underline">
                로그인
              </Link>{" "}
              후 남길 수 있습니다.
            </>
          )}
        </p>
      )}
      {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
    </div>
  );
}
