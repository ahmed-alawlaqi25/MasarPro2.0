-- TABLES
create table public.profiles (
  user_id uuid not null,
  email text not null,
  name text not null,
  avatar_url text null,
  created_at timestamptz not null default now(),
  constraint profiles_pkey primary key (user_id),
  constraint profiles_email_key unique (email),
  constraint profiles_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete cascade
);

create table public.jobs (
  job_id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  company_name text not null,
  job_title text not null,
  job_url text null,
  location text null,
  notes text null,
  status text not null default 'wishlist',
  created_at timestamptz not null default now(),
  constraint jobs_pkey primary key (job_id),
  constraint jobs_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete cascade,
  constraint jobs_status_check check (
    status in ('wishlist','applied','interview','offer','accepted')
  )
);

create table public.resumes (
  resume_id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'Untitled Resume',
  template_name text not null default 'default',
  content jsonb not null default '{}'::jsonb,
  public_slug text null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resumes_pkey primary key (resume_id),
  constraint resumes_public_slug_key unique (public_slug),
  constraint resumes_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete cascade
);

-- RLS
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.resumes enable row level security;
-- (policies from the SQL-Editor query go below)




alter table public.resumes
  add constraint resumes_id_user_key unique (resume_id, user_id);


alter table public.jobs
  add column resume_id uuid null;


alter table public.jobs
  add constraint jobs_resume_fkey
  foreign key (resume_id, user_id)
  references public.resumes (resume_id, user_id)
  on delete set null (resume_id);

create index jobs_resume_id_idx on public.jobs (resume_id);

-- FUNCTION: delete_user
-- Allows an authenticated user to permanently delete their own account.
-- Deleting the user from auth.users cascades to profiles, jobs, and resumes.
create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete from auth.users (cascades to profiles, jobs, resumes via foreign keys)
  delete from auth.users where id = v_user_id;
end;
$$;

revoke all on function public.delete_user() from public;
grant execute on function public.delete_user() to authenticated;