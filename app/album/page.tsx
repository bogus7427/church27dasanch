import type { Metadata } from "next";
import { getPhotos } from "@/lib/queries";
import Gallery from "./Gallery";
import SectionNav from "@/app/components/SectionNav";

export const metadata: Metadata = { title: "교회앨범 | 다산교회" };

export default async function AlbumPage() {
  const photos = await getPhotos();
  return (
    <>
      <SectionNav slug="album" />
      <Gallery photos={photos} />
    </>
  );
}
