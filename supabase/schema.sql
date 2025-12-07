-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text check (role in ('saas', 'affiliate')) not null,
  marketing_consent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create saas_companies table
create table public.saas_companies (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  website text,
  logo_url text,
  commission_rate numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.saas_companies enable row level security;

create policy "SaaS companies are viewable by everyone." on public.saas_companies
  for select using (true);

create policy "Owners can update their saas company." on public.saas_companies
  for update using (auth.uid() = owner_id);

create policy "Owners can insert their saas company." on public.saas_companies
  for insert with check (auth.uid() = owner_id);

-- Create partners table (affiliate details)
create table public.partners (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  bio text,
  skills text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.partners enable row level security;

create policy "Partners are viewable by everyone." on public.partners
  for select using (true);

create policy "Users can update their partner profile." on public.partners
  for update using (auth.uid() = profile_id);

create policy "Users can insert their partner profile." on public.partners
  for insert with check (auth.uid() = profile_id);

-- Create partnerships table
create table public.partnerships (
  id uuid default uuid_generate_v4() primary key,
  saas_id uuid references public.saas_companies(id) on delete cascade not null,
  partner_id uuid references public.partners(id) on delete cascade not null,
  status text check (status in ('pending', 'active', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(saas_id, partner_id)
);

alter table public.partnerships enable row level security;

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can see messages sent to or from them." on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages." on public.messages
  for insert with check (auth.uid() = sender_id);
