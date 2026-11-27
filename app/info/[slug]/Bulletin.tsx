"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** 주보·다산칼럼: posts 표의 해당 분류 글. content = 본문 + 이미지 줄 (주보는 주소만, 칼럼은 "[이미지] 주소") */
type Row = { id: number; title: string; content: string | null; created_at: string };
const PAGE = 20;
const isImg = (l: string) => l.startsWith("[이미지] ") || /^https?:\/\/\S+\.(jpe?g|png|gif)$/i.test(l);

export default function Bulletin({ category = "주보" }: { category?: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id,title,content,created_at")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .range(0, 999)
      .then(({ data }) => {
        const list = (data as Row[]) ?? [];
        setRows(list);
        if (list[0]) setOpen(list[0].id); // 최신 글은 펼쳐서 보여줌
      });
  }, [category]);

  if (rows === null) return <p className="py-16 text-center text-navy/40">불러오는 중…</p>;
  if (rows.length === 0) return <p className="py-16 text-center text-navy/40">등록된 글이 없습니다.</p>;

  return (
    <div>
      <div className="grid grid-cols-[60px_1fr_110px] border-y-2 border-navy py-3 text-center text-sm font-bold text-navy">
        <span>번호</span>
        <span>제목</span>
        <span>날짜</span>
      </div>
      <ul>
        {rows.slice(0, shown).map((r, i) => {
          const lines = (r.content ?? "").split("\n");
          const imgs = lines.filter(isImg).map((l) => l.replace("[이미지] ", ""));
          const text = lines.filter((l) => !isImg(l)).join("\n").trim();
          const isOpen = open === r.id;
          return (
            <li key={r.id} className="border-b border-navy/10">
              <button
                onClick={() => setOpen(isOpen ? null : r.id)}
                className={`grid w-full grid-cols-[60px_1fr_110px] items-center py-4 text-center hover:bg-cream ${isOpen ? "bg-cream" : ""}`}
              >
                <span className="text-sm text-navy/40">{rows.length - i}</span>
                <span className="text-left font-semibold text-navy">
                  {r.title} <span className="ml-1 text-xs text-navy/40">{isOpen ? "▲" : "▼"}</span>
                </span>
                <span className="text-sm text-navy/50">{r.created_at.slice(0, 10).replaceAll("-", ".")}</span>
              </button>
              {isOpen && (
                <div className="space-y-4 bg-cream/50 p-4 md:p-6">
                  {text && <p className="mx-auto max-w-3xl whitespace-pre-line rounded-xl bg-white p-6 leading-8 text-navy/80 md:p-8">{text}</p>}
                  {imgs.map((src, k) => (
                    <a key={src} href={src} target="_blank" rel="noreferrer" className="block">
                      <img src={src} alt={`${r.title} ${k + 1}`} loading="lazy" className="mx-auto w-full max-w-3xl rounded-xl shadow" />
                    </a>
                  ))}
                  {imgs.length > 0 && <p className="text-center text-xs text-navy/40">이미지를 누르면 크게 볼 수 있습니다.</p>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {rows.length > shown && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setShown((n) => n + PAGE)}
            className="rounded-full border border-navy/20 px-10 py-3 text-sm text-navy hover:border-navy"
          >
            더 보기 ({shown} / {rows.length})
          </button>
        </div>
      )}
    </div>
  );
}
