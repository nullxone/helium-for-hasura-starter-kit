-- migrations/XXXXXXXXXXXXX_create_app_schema/up.sql

create extension if not exists "uuid-ossp";

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