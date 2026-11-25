"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Comments from "../../components/Comments";

type News = { id: number; tag: string; title: string; content: string | null; created_at: string };

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<News | null | undefined>(undefined);

  useEffect(() => {
    supabase
      .from("news")
      .select("id,tag,title,content,created_at")
      .eq("id", Number(id))
      .maybeSingle()
      .then(({ data }) => setItem((data as News) ?? null));
  }, [id]);

  if (item === undefined) return <p className="py-40 text-center text-navy/40">불러오는 중…</p>;
  if (item === null)
    return (
      <p className="py-40 text-center text-navy/60">
        소식을 찾을 수 없습니다.{" "}
        <Link href="/#news" className="underline">
          목록으로
        </Link>
      </p>
    );

  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <Link href="/#news" className="text-sm text-navy/50 hover:text-navy">
        ← 교회 소식
      </Link>
      <span className="mt-6 inline-block rounded-full bg-cream px-3 py-1 text-xs text-gold">{item.tag}</span>
      <h1 className="mt-3 text-4xl text-navy md:text-5xl">{item.title}</h1>
      <p className="mt-3 text-sm text-navy/40">{item.created_at.slice(0, 10).replaceAll("-", ".")}</p>
      <div className="mt-8 whitespace-pre-wrap rounded-3xl bg-white p-8 leading-8 text-navy/80">
        {item.content || "내용이 없습니다."}
      </div>
      <Comments targetType="news" targetId={String(item.id)} />
    </article>
  );
}
