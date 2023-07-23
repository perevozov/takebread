create table if not exists sessions
(
    id uuid not null default gen_random_uuid(),
    user_id int not null references users(id) on delete cascade, 
    date_create timestamptz not null default current_timestamp,
    date_expires timestamptz
);