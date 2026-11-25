"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

export type CoverVideo = { yt: string; title: string; date: string };

const bands = ["#7fd0ea", "#c4e38f", "#8fd5bf", "#bfe6f3", "#a9d66b", "#5cc0e0"];

/** 가운데 카드는 정면, 양옆 카드는 3D 로 기울어진 커버플로우 */
export default function VideoCoverflow({ videos, channelUrl }: { videos: CoverVideo[]; channelUrl: string }) {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const touchX = useRef<number | null>(null);

  const go = (i: number) => {
    setPlaying(null);
    setCur((i + videos.length) % videos.length);
  };

  if (videos.length === 0) {
    return (
      <p className="py-16 text-center text-navy/50">
        영상을 불러오지 못했습니다.{" "}
        <a href={channelUrl} target="_blank" rel="noreferrer" className="underline">
          유튜브 채널에서 보기 →
        </a>
      </p>
    );
  }

  return (
    <div
      className="relative"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(cur + 1);
        if (e.key === "ArrowLeft") go(cur - 1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {/* 무대 */}
      <div className="relative mx-auto h-[300px] [perspective:1800px] sm:h-[440px] md:h-[520px]">
        {videos.map((v, i) => {
          let off = i - cur;
          const half = Math.floor(videos.length / 2);
          if (off > half) off -= videos.length;
          if (off < -half) off += videos.length;
          const abs = Math.abs(off);
          if (abs > 3) return null;
          const center = off === 0;
          const band = bands[i % bands.length];

          return (
            <div
              key={v.yt}
              onClick={() => !center && go(i)}
              className={`absolute left-1/2 top-1/2 w-[78%] max-w-[640px] overflow-hidden rounded-2xl bg-white transition-all duration-700 ease-out sm:w-[60%] ${
                center ? "cursor-default shadow-[0_40px_80px_-20px_rgba(22,56,79,0.3)]" : "cursor-pointer shadow-[0_20px_40px_-15px_rgba(22,56,79,0.22)]"
              }`}
              style={{
                transform: `translate(-50%, -50%) translateX(${off * 46}%) translateZ(${-abs * 220}px) rotateY(${off * -32}deg)`,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1,
                filter: center ? "none" : "saturate(0.85)",
              }}
            >
              {/* 미니 페이지 헤더 */}
              <div className="flex justify-between gap-4 px-4 pt-3 text-[10px] font-bold uppercase leading-tight text-black sm:text-[11px]">
                <span className="underline underline-offset-2">Dasan TV</span>
                <span className="font-mono font-normal">{v.date}</span>
              </div>
              <div className="mt-2 px-4 pb-2 pt-1" style={{ background: band }}>
                <p className="line-clamp-1 text-xl font-black leading-tight tracking-tight text-black sm:text-3xl">{v.title}</p>
              </div>
              {/* 영상 */}
              <div className="relative aspect-video bg-black" style={{ borderTop: `10px solid ${band}` }}>
                {center && playing === v.yt ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    onClick={(e) => {
                      if (!center) return;
                      e.stopPropagation();
                      setPlaying(v.yt);
                    }}
                    className="group absolute inset-0"
                    aria-label={`${v.title} 재생`}
                    tabIndex={center ? 0 : -1}
                  >
                    <img src={`https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
                    {center && (
                      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black text-xl text-white transition group-hover:scale-110 group-hover:bg-[#ff0000]">
                        ▶
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 컨트롤 */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button onClick={() => go(cur - 1)} aria-label="이전 영상" className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy shadow hover:bg-navy hover:text-white">
          ←
        </button>
        <div className="flex gap-2">
          {videos.map((v, i) => (
            <button
              key={v.yt}
              onClick={() => go(i)}
              aria-label={`${i + 1}번 영상`}
              className={`h-2 rounded-full transition-all ${i === cur ? "w-8 bg-navy" : "w-2 bg-navy/20"}`}
            />
          ))}
        </div>
        <button onClick={() => go(cur + 1)} aria-label="다음 영상" className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy shadow hover:bg-navy hover:text-white">
          →
        </button>
      </div>
    </div>
  );
}
