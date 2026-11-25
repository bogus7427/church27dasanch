"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

/** 썸네일을 먼저 보여주고, 클릭하면 유튜브 플레이어로 교체 (페이지 로딩 가볍게) */
export default function Player({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black shadow-[8px_8px_0_#000]">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`${title} 재생`}>
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black text-2xl text-white transition group-hover:scale-110">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
