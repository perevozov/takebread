create table if not exists items
(
    id uuid primary key default gen_random_uuid(),
    /* owner_id int not null, */
    title varchar(2048) not null,
    date_create timestamptz not null default current_timestamp
);

create table if not exists lists
(
    id uuid primary key default gen_random_uuid(),
    owner_id int not null references users(id) on delete cascade,
    /* owner_id int not null, */
    title varchar(2048) not null,
    date_create timestamptz default current_timestamp
);

create table if not exists item_list
(
    list_id uuid not null references lists(id) on delete cascade,
    item_id uuid not null references items(id) on delete cascade, 
    position int,
    constraint pk_item_list primary key (list_id, item_id)
);

create index ix_item_list on item_list(item_id);

create table if not exists users
(
    id serial not null primary key,
    email text not null,
    password_hash text
);