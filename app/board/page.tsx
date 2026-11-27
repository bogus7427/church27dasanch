"use client";

import Link from "next/link";
import SectionNav from "@/app/components/SectionNav";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/useProfile";

type Post = { id: number; category: string; title: string; author_name: string | null; created_at: string; href: string };

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [cat, setCat] = useState("전체");
  const { isAdmin } = useProfile();

  useEffect(() => {
    // 교회소식 = 소식(news 표: 홈 화면 교회소식과 같은 글) + 게시판 글(posts, 주보·칼럼·영상 메뉴 글 제외)
    Promise.all([
      supabase.from("news").select("id,tag,title,created_at").order("created_at", { ascending: false }).limit(200),
      supabase
        .from("posts")
        .select("id,category,title,author_name,created_at")
        .not("category", "in", "(주보,다산칼럼,초청강의,특별행사,찬양대)") // 이 분류들은 각 메뉴에서만
        .order("created_at", { ascending: false })
        .limit(200),
    ]).then(([n, b]) => {
      const news: Post[] = (n.data ?? []).map((x) => ({ id: x.id, category: x.tag ?? "소식", title: x.title, author_name: null, created_at: x.created_at, href: `/news/${x.id}` }));
      const posts: Post[] = (b.data ?? []).map((x) => ({ ...x, href: `/board/${x.id}` }));
      setPosts([...news, ...posts].sort((a, c) => c.created_at.localeCompare(a.created_at)));
    });
  }, []);

  const cats = ["전체", ...new Set((posts ?? []).map((p) => p.category))];
  const list = (posts ?? []).filter((p) => cat === "전체" || p.category === cat);

  return (
    <>
    <SectionNav slug="news" />
    <div className="mx-auto max-w-4xl px-5 py-20">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-5xl text-navy">교회소식</h1>
        {isAdmin && (
          <Link href="/board/write" className="btn shrink-0 rounded-full bg-navy px-6 py-2.5 text-white hover:bg-gold">
            ✏️ 글쓰기
          </Link>
        )}
      </div>
      <p className="mt-3 text-navy/60">다산교회의 이야기와 나눔. 로그인하면 댓글을 남길 수 있어요.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`btn rounded-full px-4 py-1 ${cat === c ? "bg-navy text-white" : "bg-white text-navy hover:bg-cream"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-navy/10 rounded-2xl bg-white">
        {posts === null && <li className="px-6 py-10 text-center text-navy/40">불러오는 중…</li>}
        {posts && list.length === 0 && <li className="px-6 py-10 text-center text-navy/40">게시글이 없습니다.</li>}
        {list.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="flex items-center gap-4 px-6 py-5 hover:bg-cream/50">
              <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-xs text-gold">{p.category}</span>
              <span className="min-w-0 flex-1 truncate text-navy">{p.title}</span>
              <span className="hidden shrink-0 text-sm text-navy/40 sm:block">{p.author_name ?? "관리자"}</span>
              <span className="shrink-0 text-sm text-navy/40">{p.created_at.slice(0, 10).replaceAll("-", ".")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
