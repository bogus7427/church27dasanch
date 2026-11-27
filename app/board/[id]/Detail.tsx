"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Comments from "../../components/Comments";
import { useProfile } from "@/lib/useProfile";

type Post = {
  id: number;
  category: string;
  title: string;
  content: string | null;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
};

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const { isAdmin } = useProfile();
  const router = useRouter();

  async function remove() {
    if (!confirm("이 글을 삭제할까요?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", Number(id));
    if (error) return alert(`삭제하지 못했습니다: ${error.message}`);
    router.push("/board");
  }

  useEffect(() => {
    supabase
      .from("posts")
      .select("id,category,title,content,image_url,author_name,created_at")
      .eq("id", Number(id))
      .maybeSingle()
      .then(({ data }) => setPost((data as Post) ?? null));
  }, [id]);

  if (post === undefined) return <p className="py-40 text-center text-navy/40">불러오는 중…</p>;
  if (post === null)
    return (
      <p className="py-40 text-center text-navy/60">
        글을 찾을 수 없습니다.{" "}
        <Link href="/board" className="underline">
          목록으로
        </Link>
      </p>
    );

  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <div className="flex items-center justify-between">
        <Link href="/board" className="text-sm text-navy/50 hover:text-navy">
          ← 교회소식
        </Link>
        {isAdmin && (
          <span className="flex gap-2 text-sm">
            <Link href={`/board/write?id=${post.id}`} className="rounded-full border border-navy/20 px-4 py-1.5 text-navy hover:bg-cream">
              수정
            </Link>
            <button onClick={remove} className="rounded-full border border-red-200 px-4 py-1.5 text-red-500 hover:bg-red-50">
              삭제
            </button>
          </span>
        )}
      </div>
      <span className="mt-6 inline-block rounded-full bg-cream px-3 py-1 text-xs text-gold">{post.category}</span>
      <h1 className="mt-3 text-4xl text-navy md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-navy/40">
        {post.author_name ?? "관리자"} · {post.created_at.slice(0, 10).replaceAll("-", ".")}
      </p>
      {/* 본문의 이미지 줄("[이미지] 주소" 또는 주소만)은 사진으로, 나머지는 글로 */}
      {(() => {
        const lines = (post.content ?? "").split("\n");
        const isImg = (l: string) => l.startsWith("[이미지] ") || /^https?:\/\/\S+\.(jpe?g|png|gif)$/i.test(l.trim());
        const imgs = lines.filter(isImg).map((l) => l.replace("[이미지] ", "").trim());
        const text = lines.filter((l) => !isImg(l)).join("\n").trim();
        const pics = imgs.length ? imgs : post.image_url ? [post.image_url] : [];
        return (
          <>
            {text && <div className="mt-8 whitespace-pre-wrap rounded-3xl bg-white p-8 leading-8 text-navy/80">{text}</div>}
            {pics.map((src) => (
              <a key={src} href={src} target="_blank" rel="noreferrer" className="mt-6 block">
                <img src={src} alt="" loading="lazy" className="w-full rounded-3xl object-cover" />
              </a>
            ))}
            {!text && pics.length === 0 && <div className="mt-8 rounded-3xl bg-white p-8 text-navy/80">내용이 없습니다.</div>}
          </>
        );
      })()}
      <Comments targetType="post" targetId={String(post.id)} />
    </article>
  );
}
