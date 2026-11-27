import type { Metadata } from "next";
import { Suspense } from "react";
import { Black_Han_Sans, Dongle, Jua } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeButton from "./components/HomeButton";

// 구글 폰트 (모두 SIL Open Font License - 무료, 상업적 사용 가능)
const display = Black_Han_Sans({ variable: "--font-display-kr", weight: "400", subsets: ["latin"], display: "swap" }); // 굵은 제목
const body = Jua({ variable: "--font-sans-kr", weight: "400", subsets: ["latin"], display: "swap" }); // 본문·그 외
const btn = Dongle({ variable: "--font-btn-kr", weight: ["300", "400", "700"], subsets: ["latin"], display: "swap" }); // 버튼

export const metadata: Metadata = {
  title: "다산교회 | Church27 Dasan",
  description: "김준영 목사 시무, 경북 고령군 다산면 — 하나님의 기쁨이 되는 행복한 다산교회",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${display.variable} ${body.variable} ${btn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* 교회소개 새 창(dasanIntro)에서는 헤더 숨김 — 화면 그리기 전에 표시 */}
        <script dangerouslySetInnerHTML={{ __html: `if(window.name==="dasanIntro"&&!matchMedia("(pointer: coarse)").matches)document.documentElement.classList.add("popup")` }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <HomeButton />
        </Suspense>
      </body>
    </html>
  );
}
