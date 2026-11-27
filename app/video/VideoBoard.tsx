"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Player from "./Player";
import Comments from "../components/Comments";

export type BoardVideo = { yt: string; title: string; date: string; verse: string | null };

// 참고 스타일: 파스텔 핑크 / 라벤더 / 코랄 / 세이지
const tones = [
  { bg: "#dff2f9", ink: "#0b6f96" },
  { bg: "#dcf0e9", ink: "#2d7f69" },
  { bg: "#eaf5d8", ink: "#5a8a25" },
  { bg: "#e3f1f6", ink: "#16384f" },
];

export default function VideoBoard({ videos, channelUrl }: { videos: BoardVideo[]; channelUrl: string }) {
  const [sel, setSel] = useState(0);
  const cur = videos[sel];

  if (!cur) {
    return (
      <p className="px-5 py-32 text-center font-light text-[#16384f]/60">
        영상을 불러오지 못했습니다.{" "}
        <a href={channelUrl} target="_blank" rel="noreferrer" className="underline">
          유튜브 채널에서 보기
        </a>
      </p>
    );
  }

  return (
    <>
      {/* FEATURED: 영상 + 설명 2단 */}
      <section id="featured" className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-10 px-5 pb-24 pt-4 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div>
          <Player key={cur.yt} id={cur.yt} title={cur.title} />
          <div className="mt-6 flex items-center gap-3" aria-label="영상 위치">
            {videos.slice(0, 4).map((v, i) => (
              <button
                key={v.yt}
                onClick={() => setSel(i)}
                aria-label={`${i + 1}번 영상`}
                className={`grid h-8 w-8 place-items-center rounded-full text-xs transition ${
                  sel === i ? "bg-[#16384f] text-white" : "bg-[#e3eef0] text-[#16384f]/60 hover:bg-[#b9d3d9]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-[#0b8fc0]">NOW PLAYING</p>
          <h2 className="mt-4 text-3xl font-light leading-snug tracking-tight text-[#16384f] md:text-4xl">{cur.title}</h2>
          <p className="mt-4 font-light text-[#16384f]/60">
            {cur.date}
            {cur.verse && <> · {cur.verse}</>}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`https://www.youtube.com/watch?v=${cur.yt}`}
              target="_blank"
              rel="noreferrer"
              className="btn bg-[#16384f] px-7 py-3 text-white transition hover:bg-[#3fa58a]"
            >
              WATCH ON YOUTUBE
            </a>
            <a
              href={`${channelUrl}?sub_confirmation=1`}
              target="_blank"
              rel="noreferrer"
              className="btn bg-[#b6e2f2] px-7 py-3 text-[#16384f] transition hover:bg-[#0b8fc0] hover:text-white"
            >
              SUBSCRIBE
            </a>
          </div>
        </div>
      </section>

      {/* 지금 재생 중인 영상의 댓글 */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Comments targetType="video" targetId={cur.yt} />
      </section>

      {/* MORE TO WATCH: 작은 정사각 썸네일 + 제목 + 텍스트 링크 */}
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <div className="mb-8 flex items-end justify-between border-b border-[#16384f]/10 pb-5">
          <h2 className="text-2xl font-light tracking-tight text-[#16384f] md:text-3xl">더 많은 말씀</h2>
          <a href={channelUrl} target="_blank" rel="noreferrer" className="text-xs font-bold tracking-[0.2em] text-[#16384f] hover:text-[#0b8fc0]">
            VIEW ALL
          </a>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {videos.map((v, i) => {
            const t = tones[i % tones.length];
            const active = i === sel;
            return (
              <li key={v.yt}>
                <button
                  onClick={() => {
                    setSel(i);
                    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`group flex w-full items-center gap-5 p-4 text-left transition ${active ? "ring-2 ring-[#16384f]" : ""}`}
                  style={{ background: t.bg }}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${v.yt}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-[72px] w-[72px] shrink-0 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-light text-[#16384f]">{v.title}</span>
                    <span className="mt-1 block text-sm font-light" style={{ color: t.ink }}>
                      {v.date}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-[#16384f] transition group-hover:translate-x-1">
                    {active ? "PLAYING" : "WATCH →"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
