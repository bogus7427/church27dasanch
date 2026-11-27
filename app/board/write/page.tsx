import { Suspense } from "react";
import Editor from "./Editor";

export default function Page() {
  return (
    <Suspense fallback={<p className="py-40 text-center text-navy/40">불러오는 중…</p>}>
      <Editor />
    </Suspense>
  );
}
