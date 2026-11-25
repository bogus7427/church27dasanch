import type { Metadata } from "next";
import { getPhotos } from "@/lib/queries";
import Gallery from "./Gallery";

export const metadata: Metadata = { title: "교회앨범 | 다산교회" };

export default async function AlbumPage() {
  const photos = await getPhotos();
  return <Gallery photos={photos} />;
}
