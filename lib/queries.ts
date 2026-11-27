import { cacheLife } from "next/cache";
import { supabase } from "./supabase";

export type Worship = { id: number; name: string; time: string; place: string | null };
export type Sermon = { id: number; title: string; verse: string | null; video_url: string | null; preached_at: string };
export type News = { id: number; tag: string; title: string; created_at: string };

export type Photo = {
  id: number;
  title: string;
  album: string;
  image_url: string;
  description: string | null;
  taken_at: string;
  featured: boolean;
};

export async function getPhotos() {
  "use cache";
  cacheLife("minutes");
  // Supabase 는 한 번에 최대 1000줄 → 나눠서 전부 읽기
  const all: Photo[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("photos")
      .select("id,title,album,image_url,description,taken_at,featured")
      .order("taken_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, from + 999);
    if (error) {
      console.error("[supabase]", error.message);
      break;
    }
    all.push(...((data ?? []) as Photo[]));
    if (!data || data.length < 1000) break;
  }
  return all;
}

export async function getVideos() {
  "use cache";
  cacheLife("minutes");
  const { data, error } = await supabase
    .from("sermons")
    .select("id,title,verse,video_url,preached_at")
    .not("video_url", "is", null)
    .order("preached_at", { ascending: false })
    .limit(30);
  if (error) console.error("[supabase]", error.message);
  return (data ?? []) as Sermon[];
}

export const YOUTUBE_CHANNEL_ID = "UCkod_nlZU68XS0ZSjyzvsog";
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;

/** 유튜브 채널 공개 RSS 에서 최신 영상(최대 15개) 가져오기 - API 키 불필요 */
export async function getChannelVideos() {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m, i) => {
      const e = m[1];
      const pick = (re: RegExp) => e.match(re)?.[1] ?? "";
      const yt = pick(/<yt:videoId>(.*?)<\/yt:videoId>/);
      return {
        id: -(i + 1),
        title: pick(/<title>(.*?)<\/title>/)
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s*[(（]\s*전체\s*[)）]\s*/g, " ") // "(전체)" 빼기
          .trim(),
        verse: null,
        video_url: `https://www.youtube.com/watch?v=${yt}`,
        preached_at: pick(/<published>(.*?)<\/published>/),
      } satisfies Sermon;
    });
  } catch (err) {
    console.error("[youtube]", err);
    return [] as Sermon[];
  }
}

/** 유튜브 URL(watch, youtu.be, shorts, live, embed)에서 영상 ID 추출 */
export function youtubeId(url: string | null) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|live\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export async function getHomeData() {
  "use cache";
  cacheLife("minutes");

  const [w, s, n] = await Promise.all([
    supabase.from("worships").select("id,name,time,place").order("sort_order"),
    supabase.from("sermons").select("id,title,verse,video_url,preached_at").order("preached_at", { ascending: false }).limit(3),
    supabase.from("news").select("id,tag,title,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  for (const r of [w, s, n]) if (r.error) console.error("[supabase]", r.error.message);

  return {
    worships: (w.data ?? []) as Worship[],
    sermons: (s.data ?? []) as Sermon[],
    news: (n.data ?? []) as News[],
  };
}
