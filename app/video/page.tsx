import type { Metadata } from "next";
import { getChannelVideos, getVideos, youtubeId, YOUTUBE_CHANNEL_URL } from "@/lib/queries";
import { IMG } from "@/lib/images";
import VideoBoard, { type BoardVideo } from "./VideoBoard";

export const metadata: Metadata = { title: "DASAN TV | 다산교회" };

const fmt = (d: string) => d.slice(0, 10).replaceAll("-", ".");

export default async function VideoPage() {
  // DB(설교 본문 포함) + 채널 최신 영상 합치기, 같은 영상은 DB 우선
  const [db, channel] = await Promise.all([getVideos(), getChannelVideos()]);
  const seen = new Set<string>();
  const videos: BoardVideo[] = [...db, ...channel]
    .map((v) => ({ yt: youtubeId(v.video_url) ?? "", title: v.title, date: v.preached_at, verse: v.verse }))
    .filter((v) => v.yt && !seen.has(v.yt) && !!seen.add(v.yt))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((v) => ({ ...v, date: fmt(v.date) }));

  return (
    <div className="bg-white text-[#16384f]">
      {/* HERO: 큰 사진 + 짧은 문장 + 텍스트 링크 */}
      <section
        className="relative flex min-h-[78vh] items-end bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to top, rgba(22,56,79,.78), rgba(22,56,79,.1) 60%), url(${IMG.worship})` }}
      >
        <div className="mx-auto w-full max-w-6xl px-5 pb-16 text-white">
          <p className="text-xs font-bold tracking-[0.3em] text-[#b6e2f2]">DASAN TV</p>
          <h1 className="mt-4 text-5xl font-light leading-[1.1] tracking-tight md:text-7xl">
            The focus is on <span className="font-bold">HIM</span>.
          </h1>
          <p className="mt-4 max-w-md font-light text-white/80">
            주일 설교와 찬양, 다산교회의 이야기를 언제 어디서나 만나보세요.
          </p>
          <a href="#featured" className="mt-8 inline-flex items-center gap-3 text-xs font-bold tracking-[0.25em] hover:text-[#b6e2f2]">
            WATCH NOW <span className="animate-bounce">↓</span>
          </a>
        </div>
      </section>

      <VideoBoard videos={videos} channelUrl={YOUTUBE_CHANNEL_URL} />

      {/* 구독 CTA 블록 */}
      <section className="bg-[#dff2f9] px-5 py-24 text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-[#0b6f96]">STAY CONNECTED</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-light leading-snug tracking-tight md:text-5xl">
          새 말씀이 올라오면
          <br />
          가장 먼저 알려드릴게요
        </h2>
        <a
          href={`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`}
          target="_blank"
          rel="noreferrer"
          className="btn mt-10 inline-block bg-[#16384f] px-9 py-4 text-white transition hover:bg-[#0b8fc0]"
        >
          BECOME A SUBSCRIBER
        </a>
      </section>
    </div>
  );
}
