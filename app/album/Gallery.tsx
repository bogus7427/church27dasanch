"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Photo } from "@/lib/queries";

const fmt = (d: string) => d.slice(0, 10).replaceAll("-", ".");

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState("ALL");
  const [active, setActive] = useState<number | null>(null);

  const albums = useMemo(() => ["ALL", ...new Set(photos.map((p) => p.album))], [photos]);
  const featured = photos.filter((p) => p.featured);
  const list = photos.filter((p) => !p.featured && (filter === "ALL" || p.album === filter));
  const viewer = [...featured, ...list];

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (d: number) => setActive((i) => (i === null ? i : (i + d + viewer.length) % viewer.length)),
    [viewer.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, move]);

  return (
    <div className="bg-[#0d2231] text-white">
      {/* 타이틀 */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-24">
        <p className="text-xs font-medium tracking-[0.4em] text-white/40">DASAN CHURCH · ARCHIVE</p>
        <h1 className="mt-4 text-6xl font-extrabold tracking-tight md:text-8xl">
          ALBUM<span className="text-gold">.</span>
        </h1>
        <p className="mt-4 max-w-md text-white/50">함께 예배하고, 섬기고, 웃었던 순간들을 기록합니다.</p>
      </section>

      {photos.length === 0 && <p className="pb-32 text-center text-white/40">등록된 사진이 없습니다.</p>}

      {/* STILLS: 전폭 시네마틱 */}
      {featured.length > 0 && (
        <section className="space-y-2">
          {featured.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)} className="group relative block w-full overflow-hidden">
              <img
                src={p.image_url}
                alt={p.title}
                className="aspect-[2.3/1] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-6 text-left md:p-12">
                <div>
                  <p className="text-xs tracking-[0.3em] text-white/60">{p.album.toUpperCase()}</p>
                  <p className="mt-2 text-2xl font-bold md:text-5xl">{p.title}</p>
                </div>
                <p className="hidden text-sm text-white/60 md:block">{fmt(p.taken_at)}</p>
              </div>
            </button>
          ))}
        </section>
      )}

      {/* MORE MOMENTS: 카드 그리드 */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              MORE MOMENTS<span className="text-gold">.</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {albums.map((a) => (
                <button
                  key={a}
                  onClick={() => setFilter(a)}
                  className={`rounded-full border px-4 py-1.5 text-xs tracking-widest transition ${
                    filter === a ? "border-white bg-white text-black" : "border-white/20 text-white/60 hover:border-white/60"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <button key={p.id} onClick={() => setActive(featured.length + i)} className="group text-left">
                <div className="overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover grayscale-[30%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <p className="font-semibold">‘{p.title}’</p>
                  <p className="shrink-0 font-mono text-xs text-white/40">{fmt(p.taken_at)}</p>
                </div>
                <p className="mt-1 text-xs tracking-[0.25em] text-white/40 group-hover:text-gold">
                  {p.album.toUpperCase()} — VIEW PHOTO
                </p>
              </button>
            ))}
          </div>
          {list.length === 0 && <p className="py-16 text-center text-white/40">이 앨범에 사진이 없습니다.</p>}
        </section>
      )}

      {/* 라이트박스 */}
      {active !== null && viewer[active] && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95" onClick={close}>
          <div className="flex items-center justify-between p-5 text-sm text-white/60">
            <span className="font-mono">
              {String(active + 1).padStart(2, "0")} / {String(viewer.length).padStart(2, "0")}
            </span>
            <button onClick={close} className="tracking-[0.3em] hover:text-white">
              CLOSE ✕
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => move(-1)} aria-label="이전" className="absolute left-2 p-4 text-3xl text-white/50 hover:text-white md:left-6">
              ←
            </button>
            <img src={viewer[active].image_url} alt={viewer[active].title} className="max-h-[75vh] max-w-full object-contain" />
            <button onClick={() => move(1)} aria-label="다음" className="absolute right-2 p-4 text-3xl text-white/50 hover:text-white md:right-6">
              →
            </button>
          </div>
          <div className="p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-xl font-bold">{viewer[active].title}</p>
            <p className="mt-1 text-xs tracking-[0.3em] text-white/40">
              {viewer[active].album.toUpperCase()} · {fmt(viewer[active].taken_at)}
            </p>
            {viewer[active].description && <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">{viewer[active].description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
