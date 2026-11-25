-- ════════════════════════════════════════════════════════════════
-- 관리자(admin) = 모든 권한
--   public 의 모든 표에서 읽기·추가·수정·삭제, 모든 파일 저장소(Storage) 사용.
--   앞으로 새로 만드는 표에도 아래 함수 한 줄이면 같은 권한이 붙습니다:
--     select public.grant_admin_all('새표이름');
-- auth-roles.sql 실행 후에 실행 (여러 번 실행해도 안전)
-- ════════════════════════════════════════════════════════════════

-- 표 하나에 "관리자 모든 권한" 정책 붙이기
create or replace function public.grant_admin_all(tbl text)
returns void language plpgsql as $$
begin
  execute format('alter table public.%I enable row level security', tbl);
  execute format('drop policy if exists "admin all" on public.%I', tbl);
  execute format(
    'create policy "admin all" on public.%I for all using (public.is_admin()) with check (public.is_admin())', tbl);
end; $$;

-- 지금 있는 public 의 모든 표에 적용
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    perform public.grant_admin_all(t);
  end loop;
end $$;

-- 모든 파일 저장소(bucket)에서 관리자는 올리기·바꾸기·지우기·보기 가능
drop policy if exists "admin all storage" on storage.objects;
create policy "admin all storage" on storage.objects
  for all using (public.is_admin()) with check (public.is_admin());

-- 관리자 지정 확인용
-- select email, role from public.profiles order by role;
