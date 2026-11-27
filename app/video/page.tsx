import type { Metadata } from "next";
import { getChannelVideos, getVideos, youtubeId, YOUTUBE_CHANNEL_URL } from "@/lib/queries";
import SectionNav, { PageTitle } from "@/app/components/SectionNav";
import VideoBoard, { type BoardVideo } from "./VideoBoard";

export const metadata: Metadata = { title: "주일설교 | 다산교회" };

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
    <>
    <SectionNav slug="sermon" />
    <div className="bg-white text-[#16384f]">
      <div className="px-5 pt-16 md:pt-24">
        <PageTitle slug="sermon" />
      </div>

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
    </>
  );
}
