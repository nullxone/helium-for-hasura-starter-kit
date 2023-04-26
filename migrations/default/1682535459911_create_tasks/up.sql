CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  created_at timestamp with time zone not null default now()
);