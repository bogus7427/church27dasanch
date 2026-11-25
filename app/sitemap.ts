import type { MetadataRoute } from "next";

// 배포 후 실제 도메인으로 바꾸거나 .env 에 NEXT_PUBLIC_SITE_URL 을 넣으세요
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** /sitemap.xml — 검색엔진(구글·네이버)에 페이지 목록 알림 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["", "weekly", 1],
    ["/video", "weekly", 0.9],
    ["/board", "daily", 0.8],
    ["/album", "weekly", 0.7],
    ["/newcomer", "monthly", 0.7],
    ["/terms", "yearly", 0.2],
    ["/privacy", "yearly", 0.2],
  ];
  return pages.map(([path, changeFrequency, priority]) => ({
    url: `${SITE}${path}`,
    changeFrequency,
    priority,
  }));
}
