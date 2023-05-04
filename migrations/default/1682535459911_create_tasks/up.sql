CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone not null default now()
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  user_id uuid not null,
  created_at timestamp with time zone not null default now()
);