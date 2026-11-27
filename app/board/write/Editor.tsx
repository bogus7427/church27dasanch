"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { shrinkImage } from "@/lib/shrinkImage";
import { useProfile } from "@/lib/useProfile";

export const NEWS_CATEGORIES = ["공지", "행사", "교육", "새가족", "나눔"];
const input = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 text-navy outline-none transition placeholder:text-navy/30 focus:border-navy";

/** 교회소식 글쓰기·수정 (관리자). 사진은 줄여서 photos 저장소에 올리고 본문에 "[이미지] 주소" 줄로 저장 */
export default function Editor() {
  const router = useRouter();
  const editId = Number(useSearchParams().get("id")) || null;
  const { isAdmin, loading, profile } = useProfile();
  const [category, setCategory] = useState(NEWS_CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imgs, setImgs] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!editId) return;
    supabase
      .from("posts")
      .select("category,title,content")
      .eq("id", editId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const lines = (data.content ?? "").split("\n");
        setCategory(data.category);
        setTitle(data.title);
        setImgs(lines.filter((l: string) => l.startsWith("[이미지] ")).map((l: string) => l.slice(6).trim()));
        setText(lines.filter((l: string) => !l.startsWith("[이미지] ")).join("\n").trim());
      });
  }, [editId]);

  async function addPhotos(files: FileList) {
    setErr("");
    for (const [i, original] of [...files].entries()) {
      setBusy(`사진 올리는 중… (${i + 1}/${files.length})`);
      const file = await shrinkImage(original);
      const path = `news/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${file.name.split(".").pop() || "jpg"}`;
      const { error } = await supabase.storage.from("photos").upload(path, file, { contentType: file.type });
      if (error) {
        setErr(`사진 업로드 실패: ${error.message}`);
        break;
      }
      const url = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
      setImgs((a) => [...a, url]);
    }
    setBusy("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setErr("제목을 입력해주세요.");
    setBusy("저장 중…");
    setErr("");
    const content = [text.trim(), ...imgs.map((u) => `[이미지] ${u}`)].filter(Boolean).join("\n");
    const row = { category, title: title.trim(), content, image_url: imgs[0] ?? null };
    const res = editId
      ? await supabase.from("posts").update(row).eq("id", editId).select("id").single()
      : await supabase.from("posts").insert({ ...row, author_name: profile?.full_name || "관리자" }).select("id").single();
    setBusy("");
    if (res.error) return setErr(`저장하지 못했습니다: ${res.error.message}`);
    router.push(`/board/${res.data.id}`);
  }

  if (loading) return <p className="py-40 text-center text-navy/40">불러오는 중…</p>;
  if (!isAdmin)
    return (
      <p className="py-40 text-center text-navy/60">
        관리자만 글을 쓸 수 있습니다.{" "}
        <Link href="/board" className="underline">
          교회소식으로
        </Link>
      </p>
    );

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6 px-5 py-20">
      <Link href="/board" className="text-sm text-navy/50 hover:text-navy">
        ← 교회소식
      </Link>
      <h1 className="text-4xl text-navy">{editId ? "소식 수정" : "소식 올리기"}</h1>

      <div>
        <span className="mb-2 block text-sm text-navy/60">분류</span>
        <div className="flex flex-wrap gap-2">
          {NEWS_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-5 py-2 text-sm transition ${category === c ? "bg-navy text-white" : "bg-white text-navy hover:bg-cream"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm text-navy/60">제목</span>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="제목을 입력하세요" />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-navy/60">내용</span>
        <textarea className={`${input} min-h-72 leading-7`} value={text} onChange={(e) => setText(e.target.value)} placeholder="내용을 입력하세요" />
      </label>

      <div>
        <span className="mb-2 block text-sm text-navy/60">사진 (여러 장 가능 · 자동으로 줄여서 저장)</span>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {imgs.map((u) => (
            <div key={u} className="relative">
              <img src={u} alt="" className="aspect-square w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setImgs((a) => a.filter((x) => x !== u))}
                className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-sm text-white"
                aria-label="사진 빼기"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-navy/20 text-3xl text-navy/30 hover:border-navy/50">
            +
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files?.length && addPhotos(e.target.files)} />
          </label>
        </div>
      </div>

      {err && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{err}</p>}

      <div className="flex gap-3">
        <button disabled={!!busy} className="btn flex-1 rounded-xl bg-navy py-3.5 text-white transition hover:bg-black disabled:opacity-50">
          {busy || (editId ? "수정하기" : "올리기")}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-xl border border-navy/20 px-6 text-navy hover:bg-cream">
          취소
        </button>
      </div>
    </form>
  );
}
