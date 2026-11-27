"use client";

import { useEffect } from "react";

/** 주소의 #위치로 스크롤 — 글꼴·이미지가 늦게 로드돼 위치가 밀려도 다시 맞춤 */
export default function ScrollToHash() {
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    go();
    document.fonts?.ready.then(go);
    window.addEventListener("load", go);
    window.addEventListener("hashchange", go);
    const t = setTimeout(go, 600);
    return () => {
      window.removeEventListener("load", go);
      window.removeEventListener("hashchange", go);
      clearTimeout(t);
    };
  }, []);
  return null;
}
