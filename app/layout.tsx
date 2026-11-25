import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const sans = Noto_Sans_KR({ variable: "--font-sans-kr", subsets: ["latin"], weight: ["400", "500", "700"] });
const serif = Noto_Serif_KR({ variable: "--font-serif-kr", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "다산교회 | Church27 Dasan",
  description: "하나님을 사랑하고 이웃을 섬기는 다산교회",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
