create table if not exists users
(
    id serial not null primary key,
    email text not null,
    password_hash bytea
);

alter table lists add column if not exists owner_id int not null references users(id) on delete cascade;