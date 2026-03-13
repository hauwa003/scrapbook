-- Scrapbook Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Scrapbooks table
create table public.scrapbooks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  cover_url text,
  theme text default 'classic' not null,
  is_public boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Pages table
create table public.pages (
  id uuid default uuid_generate_v4() primary key,
  scrapbook_id uuid references public.scrapbooks(id) on delete cascade not null,
  page_number integer not null,
  background_color text default '#FFFBF0' not null,
  canvas_json jsonb,
  thumbnail_url text,
  created_at timestamptz default now() not null,
  unique(scrapbook_id, page_number)
);

-- Elements table (individual canvas elements for querying)
create table public.elements (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references public.pages(id) on delete cascade not null,
  type text not null check (type in ('image', 'text', 'sticker', 'shape', 'ai_image')),
  fabric_json jsonb not null default '{}',
  z_index integer default 0 not null,
  created_at timestamptz default now() not null
);

-- AI Images tracking
create table public.ai_images (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  prompt text not null,
  image_url text not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_scrapbooks_user_id on public.scrapbooks(user_id);
create index idx_scrapbooks_slug on public.scrapbooks(slug);
create index idx_pages_scrapbook_id on public.pages(scrapbook_id);
create index idx_elements_page_id on public.elements(page_id);
create index idx_ai_images_user_id on public.ai_images(user_id);

-- Updated at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger scrapbooks_updated_at
  before update on public.scrapbooks
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.users enable row level security;
alter table public.scrapbooks enable row level security;
alter table public.pages enable row level security;
alter table public.elements enable row level security;
alter table public.ai_images enable row level security;

-- Users policies
create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Scrapbooks policies
create policy "Users can view own scrapbooks"
  on public.scrapbooks for select using (auth.uid() = user_id);

create policy "Anyone can view public scrapbooks"
  on public.scrapbooks for select using (is_public = true);

create policy "Users can create scrapbooks"
  on public.scrapbooks for insert with check (auth.uid() = user_id);

create policy "Users can update own scrapbooks"
  on public.scrapbooks for update using (auth.uid() = user_id);

create policy "Users can delete own scrapbooks"
  on public.scrapbooks for delete using (auth.uid() = user_id);

-- Pages policies
create policy "Users can view pages of own scrapbooks"
  on public.pages for select using (
    exists (select 1 from public.scrapbooks where id = scrapbook_id and user_id = auth.uid())
  );

create policy "Anyone can view pages of public scrapbooks"
  on public.pages for select using (
    exists (select 1 from public.scrapbooks where id = scrapbook_id and is_public = true)
  );

create policy "Users can manage pages of own scrapbooks"
  on public.pages for all using (
    exists (select 1 from public.scrapbooks where id = scrapbook_id and user_id = auth.uid())
  );

-- Elements policies
create policy "Users can manage elements of own pages"
  on public.elements for all using (
    exists (
      select 1 from public.pages p
      join public.scrapbooks s on s.id = p.scrapbook_id
      where p.id = page_id and s.user_id = auth.uid()
    )
  );

-- AI Images policies
create policy "Users can view own AI images"
  on public.ai_images for select using (auth.uid() = user_id);

create policy "Users can create AI images"
  on public.ai_images for insert with check (auth.uid() = user_id);

-- Storage buckets (run separately in Supabase dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('scrapbook-images', 'scrapbook-images', true);
-- insert into storage.buckets (id, name, public) values ('scrapbook-covers', 'scrapbook-covers', true);

-- Auto-create user profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
