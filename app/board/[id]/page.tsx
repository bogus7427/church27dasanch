"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Comments from "../../components/Comments";

type Post = {
  id: number;
  category: string;
  title: string;
  content: string | null;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
};

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

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
      <Link href="/board" className="text-sm text-navy/50 hover:text-navy">
        ← 게시판
      </Link>
      <span className="mt-6 inline-block rounded-full bg-cream px-3 py-1 text-xs text-gold">{post.category}</span>
      <h1 className="mt-3 text-4xl text-navy md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-navy/40">
        {post.author_name ?? "관리자"} · {post.created_at.slice(0, 10).replaceAll("-", ".")}
      </p>
      {post.image_url && <img src={post.image_url} alt="" className="mt-8 w-full rounded-3xl object-cover" />}
      <div className="mt-8 whitespace-pre-wrap rounded-3xl bg-white p-8 leading-8 text-navy/80">{post.content || "내용이 없습니다."}</div>
      <Comments targetType="post" targetId={String(post.id)} />
    </article>
  );
}
