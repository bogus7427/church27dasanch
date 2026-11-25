"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ROLE_LABEL, useProfile, type Role } from "@/lib/useProfile";

// ─── 테이블 설정: 여기만 고치면 관리자 화면 항목이 바뀝니다 ───────────────
type FieldType = "text" | "textarea" | "date" | "number" | "checkbox" | "image" | "url";
type Field = { key: string; label: string; type: FieldType; required?: boolean; list?: boolean };
type TableCfg = { table: string; label: string; order: { col: string; asc: boolean }; fields: Field[] };

const TABLES: TableCfg[] = [
  {
    table: "newcomers",
    label: "새가족",
    order: { col: "created_at", asc: false },
    fields: [
      { key: "name", label: "이름", type: "text", required: true, list: true },
      { key: "gender", label: "성별 (남/여)", type: "text", list: true },
      { key: "phone", label: "전화번호", type: "text", list: true },
      { key: "address", label: "주소", type: "text", list: true },
      { key: "memo", label: "관리자 메모", type: "textarea", list: true },
      { key: "created_at", label: "신청일", type: "date", list: true },
    ],
  },
  {
    table: "posts",
    label: "게시판",
    order: { col: "created_at", asc: false },
    fields: [
      { key: "category", label: "분류", type: "text", required: true, list: true },
      { key: "title", label: "제목", type: "text", required: true, list: true },
      { key: "content", label: "내용", type: "textarea" },
      { key: "image_url", label: "이미지 (선택)", type: "image", list: true },
      { key: "author_name", label: "작성자 표시", type: "text", list: true },
      { key: "created_at", label: "날짜", type: "date", list: true },
    ],
  },
  {
    table: "worships",
    label: "예배",
    order: { col: "sort_order", asc: true },
    fields: [
      { key: "name", label: "예배 이름", type: "text", required: true, list: true },
      { key: "time", label: "시간", type: "text", required: true, list: true },
      { key: "place", label: "장소", type: "text", list: true },
      { key: "sort_order", label: "순서", type: "number", list: true },
    ],
  },
  {
    table: "sermons",
    label: "설교",
    order: { col: "preached_at", asc: false },
    fields: [
      { key: "title", label: "제목", type: "text", required: true, list: true },
      { key: "verse", label: "본문", type: "text", list: true },
      { key: "preacher", label: "설교자", type: "text" },
      { key: "video_url", label: "유튜브 주소", type: "url" },
      { key: "preached_at", label: "날짜", type: "date", required: true, list: true },
    ],
  },
  {
    table: "news",
    label: "소식",
    order: { col: "created_at", asc: false },
    fields: [
      { key: "tag", label: "분류", type: "text", required: true, list: true },
      { key: "title", label: "제목", type: "text", required: true, list: true },
      { key: "content", label: "내용", type: "textarea" },
      { key: "created_at", label: "날짜", type: "date", list: true },
    ],
  },
  {
    table: "photos",
    label: "사진",
    order: { col: "taken_at", asc: false },
    fields: [
      { key: "image_url", label: "사진", type: "image", required: true, list: true },
      { key: "title", label: "제목", type: "text", required: true, list: true },
      { key: "album", label: "앨범", type: "text", required: true, list: true },
      { key: "description", label: "설명", type: "textarea" },
      { key: "taken_at", label: "날짜", type: "date", required: true, list: true },
      { key: "featured", label: "큰 사진으로 표시", type: "checkbox", list: true },
    ],
  },
];

type Row = Record<string, unknown> & { id: number | string };
type Tab = string; // 테이블 이름 | "members" | "comments"

const input = "w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-navy outline-none focus:border-navy";

export default function AdminPage() {
  const { user, isAdmin, loading } = useProfile();
  const [tab, setTab] = useState<Tab>("newcomers");

  if (loading) return <p className="py-40 text-center text-navy/40">불러오는 중…</p>;
  if (!user || !isAdmin)
    return (
      <div className="py-40 text-center">
        <p className="text-2xl text-navy">관리자만 들어올 수 있습니다.</p>
        <Link href={user ? "/" : "/login"} className="btn mt-6 inline-block rounded-full bg-navy px-6 py-2 text-white">
          {user ? "홈으로" : "로그인"}
        </Link>
      </div>
    );

  const tabs: [Tab, string][] = [
    ...TABLES.map((t) => [t.table, t.label] as [Tab, string]),
    ["comments", "댓글"],
    ["members", "회원"],
    ["settings", "SNS 설정"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl text-navy">관리자</h1>
      <p className="mt-2 text-navy/50">추가 · 수정 · 삭제한 내용은 홈페이지에 최대 1분 안에 반영됩니다.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`btn rounded-full px-5 py-1.5 transition ${tab === k ? "bg-navy text-white" : "bg-white text-navy hover:bg-cream"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "settings" ? (
          <Settings />
        ) : tab === "members" ? (
          <Members />
        ) : tab === "comments" ? (
          <CommentsAdmin />
        ) : (
          <Crud key={tab} cfg={TABLES.find((t) => t.table === tab)!} />
        )}
      </div>
    </div>
  );
}

// ─── 공통 CRUD ───────────────────────────────────────────────────────────
function Crud({ cfg }: { cfg: TableCfg }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null); // id 가 "new" 면 새로 추가
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(cfg.table).select("*").order(cfg.order.col, { ascending: cfg.order.asc });
    if (error) setErr(error.message);
    setRows((data as Row[]) ?? []);
  }, [cfg]);

  useEffect(() => {
    load();
  }, [load]);

  const blank = (): Row => ({
    id: "new",
    ...Object.fromEntries(
      cfg.fields.map((f) => [f.key, f.type === "checkbox" ? false : f.type === "date" ? new Date().toISOString().slice(0, 10) : ""]),
    ),
  });

  async function remove(r: Row) {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) return;
    const { error } = await supabase.from(cfg.table).delete().eq("id", r.id);
    if (error) return setErr(error.message);
    // 직접 올린 사진이면 저장소에서도 삭제
    const url = String(r.image_url ?? "");
    const marker = "/storage/v1/object/public/photos/";
    if (url.includes(marker)) await supabase.storage.from("photos").remove([url.split(marker)[1]]);
    load();
  }

  const listFields = cfg.fields.filter((f) => f.list);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-navy/60">
          {cfg.label} <b className="text-navy">{rows.length}</b>개
        </p>
        <button onClick={() => setEditing(blank())} className="btn rounded-full bg-gold px-5 py-1.5 text-white hover:bg-navy">
          + 새로 추가
        </button>
      </div>
      {err && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{err}</p>}

      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy/10 text-navy/50">
            <tr>
              {listFields.map((f) => (
                <th key={f.key} className="px-4 py-3 font-normal">
                  {f.label}
                </th>
              ))}
              <th className="w-32 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)} className="border-b border-navy/5 last:border-0 hover:bg-cream/40">
                {listFields.map((f) => (
                  <td key={f.key} className="px-4 py-3 text-navy">
                    <Cell f={f} v={r[f.key]} />
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button onClick={() => setEditing(r)} className="mr-3 text-navy/60 hover:text-navy">
                    수정
                  </button>
                  <button onClick={() => remove(r)} className="text-red-400 hover:text-red-600">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={listFields.length + 1} className="px-4 py-10 text-center text-navy/40">
                  내용이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor
          cfg={cfg}
          row={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function Cell({ f, v }: { f: Field; v: unknown }) {
  if (f.type === "image") return v ? <img src={String(v)} alt="" className="h-12 w-16 rounded object-cover" /> : null;
  if (f.type === "checkbox") return <span>{v ? "✔" : ""}</span>;
  if (f.type === "date") return <span className="text-navy/60">{String(v ?? "").slice(0, 10)}</span>;
  return <span className="line-clamp-1">{String(v ?? "")}</span>;
}

function Editor({ cfg, row, onClose, onSaved }: { cfg: TableCfg; row: Row; onClose: () => void; onSaved: () => void }) {
  const [data, setData] = useState<Row>(row);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isNew = row.id === "new";

  async function upload(key: string, file: File) {
    setBusy(true);
    setErr("");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return setErr(`업로드 실패: ${error.message}`);
    const { data: pub } = supabase.storage.from("photos").getPublicUrl(path);
    setData((d) => ({ ...d, [key]: pub.publicUrl }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    for (const f of cfg.fields) if (f.required && !data[f.key] && data[f.key] !== 0) return setErr(`'${f.label}'을(를) 입력해주세요.`);
    setBusy(true);
    const payload = Object.fromEntries(
      cfg.fields.map((f) => {
        const v = data[f.key];
        if (f.type === "number") return [f.key, v === "" || v == null ? null : Number(v)];
        if (f.type === "checkbox") return [f.key, !!v];
        return [f.key, v === "" ? null : v];
      }),
    );
    const { error } = isNew
      ? await supabase.from(cfg.table).insert(payload)
      : await supabase.from(cfg.table).update(payload).eq("id", row.id);
    setBusy(false);
    if (error) return setErr(error.message);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-background p-8 shadow-2xl"
      >
        <h2 className="text-2xl text-navy">
          {cfg.label} {isNew ? "추가" : "수정"}
        </h2>
        <div className="mt-6 space-y-4">
          {cfg.fields.map((f) => {
            const v = data[f.key];
            const set = (val: unknown) => setData((d) => ({ ...d, [f.key]: val }));
            return (
              <label key={f.key} className="block">
                <span className="mb-1.5 block text-sm text-navy/60">
                  {f.label} {f.required && <span className="text-gold">*</span>}
                </span>
                {f.type === "textarea" ? (
                  <textarea className={`${input} min-h-32`} value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
                ) : f.type === "checkbox" ? (
                  <input type="checkbox" className="h-5 w-5 accent-[#0b8fc0]" checked={!!v} onChange={(e) => set(e.target.checked)} />
                ) : f.type === "image" ? (
                  <div className="space-y-2">
                    {v ? <img src={String(v)} alt="" className="h-40 w-full rounded-lg object-cover" /> : null}
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-navy/60 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-white"
                      onChange={(e) => e.target.files?.[0] && upload(f.key, e.target.files[0])}
                    />
                    <input className={input} placeholder="또는 이미지 주소 붙여넣기" value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
                  </div>
                ) : (
                  <input
                    className={input}
                    type={f.type === "date" ? "date" : f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                    value={f.type === "date" ? String(v ?? "").slice(0, 10) : String(v ?? "")}
                    onChange={(e) => set(e.target.value)}
                  />
                )}
              </label>
            );
          })}
        </div>
        {err && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{err}</p>}
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="btn flex-1 rounded-xl border border-navy/20 py-2.5 text-navy">
            취소
          </button>
          <button disabled={busy} className="btn flex-1 rounded-xl bg-navy py-2.5 text-white disabled:opacity-50">
            {busy ? "처리 중…" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── 회원 관리: 역할 변경 ─────────────────────────────────────────────────
type Member = {
  id: string;
  email: string | null;
  full_name: string | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  role: Role;
  created_at: string;
  last_sign_in_at: string | null;
};

function Members() {
  const { user } = useProfile();
  const [rows, setRows] = useState<Member[]>([]);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,gender,phone,address,role,created_at,last_sign_in_at")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    setRows((data as Member[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeRole(m: Member, role: Role) {
    if (m.id === user?.id && role !== "admin" && !confirm("본인의 관리자 권한을 해제하면 이 페이지에 다시 들어올 수 없습니다. 계속할까요?")) return;
    const { error } = await supabase.from("profiles").update({ role }).eq("id", m.id);
    if (error) return setErr(error.message);
    load();
  }

  async function removeMember(m: Member) {
    if (!confirm(`${m.full_name ?? m.email} 회원을 탈퇴 처리할까요?\n로그인 계정, 프로필, 작성한 댓글이 모두 삭제되며 되돌릴 수 없습니다.`)) return;
    const { data: s } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.session?.access_token ?? ""}` },
      body: JSON.stringify({ id: m.id }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return setErr(j.error ?? "삭제하지 못했습니다.");
    load();
  }

  const [editing, setEditing] = useState<Member | null>(null);

  async function saveMember(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editing.full_name || null,
        gender: editing.gender || null,
        phone: editing.phone || null,
        address: editing.address || null,
      })
      .eq("id", editing.id);
    if (error) return setErr(error.message);
    setEditing(null);
    load();
  }

  return (
    <div>
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <form onSubmit={saveMember} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-3xl bg-background p-8 shadow-2xl">
            <h2 className="text-2xl text-navy">회원 정보 수정</h2>
            <p className="text-sm text-navy/50">{editing.email}</p>
            {(
              [
                ["full_name", "이름"],
                ["phone", "전화번호"],
                ["address", "주소"],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className="block">
                <span className="mb-1.5 block text-sm text-navy/60">{l}</span>
                <input className={input} value={editing[k] ?? ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} />
              </label>
            ))}
            <label className="block">
              <span className="mb-1.5 block text-sm text-navy/60">성별</span>
              <select className={input} value={editing.gender ?? ""} onChange={(e) => setEditing({ ...editing, gender: e.target.value || null })}>
                <option value="">선택 안 함</option>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </label>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn flex-1 rounded-xl border border-navy/20 py-2.5 text-navy">
                취소
              </button>
              <button className="btn flex-1 rounded-xl bg-navy py-2.5 text-white">저장</button>
            </div>
          </form>
        </div>
      )}
      <p className="mb-4 text-navy/60">
        회원 <b className="text-navy">{rows.length}</b>명 · 역할: 일반사용자(읽기) / 로그인사용자(읽기+댓글) / 관리자(모든 권한)
      </p>
      {err && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-navy/10 text-navy/50">
            <tr>
              {["이름", "이메일", "성별", "전화번호", "주소", "가입일", "역할", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 text-navy">{m.full_name ?? "-"}</td>
                <td className="px-4 py-3 text-navy/70">{m.email}</td>
                <td className="px-4 py-3 text-navy/70">{m.gender ?? "-"}</td>
                <td className="px-4 py-3 text-navy/70">{m.phone ?? "-"}</td>
                <td className="max-w-48 truncate px-4 py-3 text-navy/70">{m.address ?? "-"}</td>
                <td className="px-4 py-3 text-navy/50">{m.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m, e.target.value as Role)}
                    className="rounded-lg border border-navy/15 bg-white px-2 py-1.5 text-navy"
                  >
                    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button onClick={() => setEditing(m)} className="mr-3 text-navy/60 hover:text-navy">
                    수정
                  </button>
                  {m.id !== user?.id && (
                    <button onClick={() => removeMember(m)} className="text-red-400 hover:text-red-600">
                      탈퇴
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SNS 설정 ──────────────────────────────────────────────────────────
const SNS_KEYS: [string, string, string][] = [
  ["sns_youtube", "유튜브", "https://www.youtube.com/@채널"],
  ["sns_instagram", "인스타그램", "https://www.instagram.com/계정"],
  ["sns_threads", "쓰레드", "https://www.threads.net/@계정"],
  ["sns_kakao", "카카오채널", "https://pf.kakao.com/_xxxxx"],
];

function Settings() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => setVals(Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]))));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    for (const [k, l] of SNS_KEYS) {
      const v = (vals[k] ?? "").trim();
      if (v && !/^https?:\/\//.test(v)) return setMsg({ ok: false, text: `${l} 주소는 https:// 로 시작해야 합니다.` });
    }
    setBusy(true);
    const rows = SNS_KEYS.map(([key, label]) => ({ key, label, value: (vals[key] ?? "").trim(), updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_settings").upsert(rows);
    setBusy(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "저장했습니다. 화면 위쪽 SNS 아이콘에 바로 반영됩니다." });
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-4 rounded-2xl bg-white p-8">
      <p className="text-sm text-navy/60">주소를 비워두면 그 아이콘은 화면에 표시되지 않습니다.</p>
      {SNS_KEYS.map(([k, l, ph]) => (
        <label key={k} className="block">
          <span className="mb-1.5 block text-sm text-navy/60">{l}</span>
          <input
            className={input}
            type="url"
            placeholder={ph}
            value={vals[k] ?? ""}
            onChange={(e) => setVals((v) => ({ ...v, [k]: e.target.value }))}
          />
        </label>
      ))}
      {msg && <p className={`rounded-lg px-4 py-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{msg.text}</p>}
      <button disabled={busy} className="btn rounded-xl bg-navy px-8 py-2.5 text-white disabled:opacity-50">
        {busy ? "저장 중…" : "저장"}
      </button>
    </form>
  );
}

// ─── 댓글 관리 ──────────────────────────────────────────────────────────
function CommentsAdmin() {
  const [rows, setRows] = useState<{ id: number; target_type: string; target_id: string; author_name: string | null; content: string; created_at: string }[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("id,target_type,target_id,author_name,content,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    await supabase.from("comments").delete().eq("id", id);
    load();
  }

  const where = (t: string, id: string) =>
    t === "news" ? `/news/${id}` : t === "post" ? `/board/${id}` : t === "video" ? "/video" : "/";

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-navy/10 text-navy/50">
          <tr>
            {["작성자", "내용", "위치", "작성일", ""].map((h) => (
              <th key={h} className="px-4 py-3 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-b border-navy/5 last:border-0">
              <td className="px-4 py-3 text-navy">{c.author_name ?? "-"}</td>
              <td className="max-w-md px-4 py-3 text-navy/80">
                <span className="line-clamp-2">{c.content}</span>
              </td>
              <td className="px-4 py-3">
                <Link href={where(c.target_type, c.target_id)} className="text-gold hover:underline">
                  {c.target_type}
                </Link>
              </td>
              <td className="px-4 py-3 text-navy/50">{c.created_at.slice(0, 10)}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => remove(c.id)} className="text-red-400 hover:text-red-600">
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-navy/40">
                댓글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
