create table shared_tasks (
  id uuid primary key default uuid_generate_v4(),
  with_user_id uuid not null,
  task_id uuid not null,
  created_at timestamp with time zone not null default now()
);