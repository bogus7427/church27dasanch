-- ════════════════════════════════════════════════════════════════
-- 회원 · 역할 · 관리자 권한 · 댓글 · 사진 업로드  (SQL Editor 에서 한 번 실행, 여러 번 실행해도 안전)
--
-- 역할(role)
--   guest  = 일반사용자   : 읽기만
--   member = 로그인사용자 : 읽기 + 댓글 쓰기   (가입하면 기본값)
--   admin  = 관리자       : 모든 권한 (추가·수정·삭제·사진 업로드·회원 역할 변경)
--   ※ 로그인하지 않은 방문자도 '일반사용자'처럼 읽기만 됩니다.
-- ════════════════════════════════════════════════════════════════

-- 1) 회원 정보 ------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  provider text,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);
alter table public.profiles add column if not exists gender text;        -- 남 / 여
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists onboarded_at timestamptz; -- 프로필 첫 입력 완료 시각

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('guest', 'member', 'admin'));
alter table public.profiles drop constraint if exists profiles_gender_check;
alter table public.profiles add constraint profiles_gender_check check (gender is null or gender in ('남', '여'));

-- 현재 로그인한 사람의 역할 (RLS 안에서 쓰려고 security definer)
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'guest');
$$;
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin';
$$;

alter table public.profiles enable row level security;
drop policy if exists "본인 조회" on public.profiles;
drop policy if exists "본인 수정" on public.profiles;
drop policy if exists "profiles select" on public.profiles;
drop policy if exists "profiles update" on public.profiles;
drop policy if exists "profiles delete" on public.profiles;
create policy "profiles select" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles update" on public.profiles for update using (auth.uid() = id or public.is_admin());
create policy "profiles delete" on public.profiles for delete using (public.is_admin());

-- 본인이 자기 역할을 올리지 못하게 (관리자 / SQL Editor / 서버 Secret key 는 가능)
create or replace function public.guard_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception '역할은 관리자만 바꿀 수 있습니다.';
  end if;
  return new;
end; $$;
drop trigger if exists guard_role_change on public.profiles;
create trigger guard_role_change before update on public.profiles
  for each row execute function public.guard_role_change();

-- 가입 시 자동 생성 / 로그인 시 시간 갱신
create or replace function public.handle_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider, created_at, last_sign_in_at)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_app_meta_data ->> 'provider',
    new.created_at, new.last_sign_in_at
  )
  on conflict (id) do update set
    email = excluded.email,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    last_sign_in_at = excluded.last_sign_in_at;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of last_sign_in_at, email on auth.users
  for each row execute function public.handle_auth_user();

-- 이미 가입한 회원 채우기
insert into public.profiles (id, email, full_name, avatar_url, provider, created_at, last_sign_in_at)
select id, email,
       coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
       raw_user_meta_data ->> 'avatar_url', raw_app_meta_data ->> 'provider',
       created_at, last_sign_in_at
from auth.users
on conflict (id) do nothing;

-- 2) 콘텐츠: 누구나 읽기, 관리자만 추가·수정·삭제 --------------------
do $$
declare t text;
begin
  foreach t in array array['worships', 'sermons', 'news', 'photos'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "admin insert" on public.%I for insert with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update using (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete using (public.is_admin())', t);
  end loop;
end $$;

-- 3) 댓글: 누구나 읽기, 로그인사용자·관리자만 쓰기, 본인 또는 관리자만 삭제 --
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  target_type text not null check (target_type in ('news', 'sermon', 'video', 'photo')),
  target_id text not null,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists comments_target_idx on public.comments (target_type, target_id, created_at);

-- 작성자 이름은 프로필에서 자동으로
create or replace function public.fill_comment_author()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid();
  select coalesce(nullif(full_name, ''), split_part(email, '@', 1)) into new.author_name
  from public.profiles where id = auth.uid();
  return new;
end; $$;
drop trigger if exists fill_comment_author on public.comments;
create trigger fill_comment_author before insert on public.comments
  for each row execute function public.fill_comment_author();

alter table public.comments enable row level security;
drop policy if exists "comments read" on public.comments;
drop policy if exists "comments write" on public.comments;
drop policy if exists "comments edit" on public.comments;
drop policy if exists "comments delete" on public.comments;
create policy "comments read" on public.comments for select using (true);
create policy "comments write" on public.comments for insert
  with check (auth.uid() is not null and public.my_role() in ('member', 'admin'));
create policy "comments edit" on public.comments for update using (user_id = auth.uid());
create policy "comments delete" on public.comments for delete using (user_id = auth.uid() or public.is_admin());

-- 4) 사진 업로드 공간 (Storage) : 누구나 보기, 관리자만 올리기·지우기 -----
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "photos public read" on storage.objects;
drop policy if exists "photos admin insert" on storage.objects;
drop policy if exists "photos admin update" on storage.objects;
drop policy if exists "photos admin delete" on storage.objects;
create policy "photos public read" on storage.objects for select using (bucket_id = 'photos');
create policy "photos admin insert" on storage.objects for insert with check (bucket_id = 'photos' and public.is_admin());
create policy "photos admin update" on storage.objects for update using (bucket_id = 'photos' and public.is_admin());
create policy "photos admin delete" on storage.objects for delete using (bucket_id = 'photos' and public.is_admin());

-- 5) 새가족 등록 신청: 누구나(로그인 없이도) 신청, 관리자만 조회·수정·삭제 ----
create table if not exists public.newcomers (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 30),
  gender text check (gender is null or gender in ('남', '여')),
  phone text check (phone is null or char_length(phone) <= 20),
  address text check (address is null or char_length(address) <= 120),
  memo text,                       -- 관리자 메모 (심방, 안내 여부 등)
  created_at timestamptz not null default now()
);
alter table public.newcomers enable row level security;
drop policy if exists "newcomers apply" on public.newcomers;
drop policy if exists "newcomers admin read" on public.newcomers;
drop policy if exists "newcomers admin update" on public.newcomers;
drop policy if exists "newcomers admin delete" on public.newcomers;
create policy "newcomers apply" on public.newcomers for insert with check (memo is null or public.is_admin());
create policy "newcomers admin read" on public.newcomers for select using (public.is_admin());
create policy "newcomers admin update" on public.newcomers for update using (public.is_admin());
create policy "newcomers admin delete" on public.newcomers for delete using (public.is_admin());

-- 6) 게시판(posts): 누구나 읽기, 관리자만 작성·수정·삭제, 로그인사용자는 댓글 ------
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  category text not null default '자유',
  title text not null check (char_length(title) between 1 and 200),
  content text,
  image_url text,
  author_id uuid default auth.uid() references auth.users (id) on delete set null,
  author_name text,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;
drop policy if exists "posts read" on public.posts;
drop policy if exists "admin insert" on public.posts;
drop policy if exists "admin update" on public.posts;
drop policy if exists "admin delete" on public.posts;
create policy "posts read" on public.posts for select using (true);
create policy "admin insert" on public.posts for insert with check (public.is_admin());
create policy "admin update" on public.posts for update using (public.is_admin());
create policy "admin delete" on public.posts for delete using (public.is_admin());

-- 댓글 대상에 게시판 추가
alter table public.comments drop constraint if exists comments_target_type_check;
alter table public.comments add constraint comments_target_type_check
  check (target_type in ('news', 'sermon', 'video', 'photo', 'post'));

-- 7) 사이트 설정(SNS 주소 등): 누구나 읽기, 관리자만 수정 ------------------------
create table if not exists public.site_settings (
  key text primary key,
  label text,
  value text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "settings read" on public.site_settings;
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, label, value) values
  ('sns_youtube',   '유튜브',     'https://www.youtube.com/channel/UCkod_nlZU68XS0ZSjyzvsog'),
  ('sns_instagram', '인스타그램', ''),
  ('sns_threads',   '쓰레드',     ''),
  ('sns_kakao',     '카카오채널', '')
on conflict (key) do nothing;

-- 8) 첫 관리자 지정: 아래 이메일을 본인 것으로 바꿔서 실행 ---------------
-- update public.profiles set role = 'admin' where email = '본인이메일@gmail.com';
