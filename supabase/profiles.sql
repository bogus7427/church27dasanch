-- 회원(로그인) 정보 테이블: profiles
-- Supabase 로그인 계정(auth.users)과 1:1 로 연결되고, 가입하면 자동으로 한 줄이 생깁니다.
-- SQL Editor 에서 한 번 실행 (여러 번 실행해도 안전)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  provider text,                                  -- email / google
  role text not null default 'member'             -- member / admin
    check (role in ('member', 'admin')),
  phone text,
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

-- 보안: 본인 정보만 읽고 고칠 수 있음 (role 은 본인이 못 바꿈)
alter table public.profiles enable row level security;

drop policy if exists "본인 조회" on public.profiles;
create policy "본인 조회" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "본인 수정" on public.profiles;
create policy "본인 수정" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

-- 가입 시 자동 생성 / 로그인 시 마지막 로그인 시간 갱신
create or replace function public.handle_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider, created_at, last_sign_in_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_app_meta_data ->> 'provider',
    new.created_at,
    new.last_sign_in_at
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    last_sign_in_at = excluded.last_sign_in_at;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of last_sign_in_at, email on auth.users
  for each row execute function public.handle_auth_user();

-- 이미 가입한 회원도 채워 넣기
insert into public.profiles (id, email, full_name, avatar_url, provider, created_at, last_sign_in_at)
select id, email,
       coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
       raw_user_meta_data ->> 'avatar_url',
       raw_app_meta_data ->> 'provider',
       created_at, last_sign_in_at
from auth.users
on conflict (id) do nothing;
