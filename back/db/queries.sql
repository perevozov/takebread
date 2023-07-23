-- name: CreateItem :one
INSERT INTO items (title) VALUES ($1) RETURNING *;

-- name: CreateItemWithId :one
INSERT INTO items (id, title) VALUES ($1, $2) RETURNING *;

-- name: UpdateItem :one
UPDATE items SET title=$2 WHERE id=$1 RETURNING *;

-- name: GetItem :one
SELECT * FROM items WHERE id = $1 LIMIT 1;

-- name: DeleteItem :exec
DELETE FROM items WHERE id = $1;

-- name: ListItems :many
SELECT * FROM items;

-- name: ListItemsByList :many
SELECT 
i.*,
il.position
FROM 
    item_list il
    INNER JOIN items i on i.id=il.item_id
WHERE il.list_id=$1
ORDER BY il.position asc
;

-- name: CreateList :one
INSERT INTO lists (
  title
) VALUES (
  $1
)
RETURNING *;

-- name: UpdateList :one
UPDATE lists SET title=$2 WHERE id=$1 RETURNING *;

-- name: AddToList :one
INSERT 
INTO item_list (list_id, item_id, position) 
VALUES ($1, $2, $3) RETURNING *;

-- name: RemoveFromList :exec
DELETE FROM item_list WHERE list_id=$1 and item_id=$2;

-- name: RemoveAllFromList :exec
DELETE FROM item_list WHERE list_id=$1;

-- name: ListLists :many
SELECT * FROM lists ORDER BY date_create desc;

-- name: GetList :one
SELECT * FROM lists WHERE id=$1;

-- name: FindUserByEmail :one
SELECT * FROM users WHERE email=$1;

-- name: CreateUser :one
INSERT 
INTO users(email, password_hash)
VALUES ($1, $2) 
RETURNING *;

-- name: CreateSession :one
INSERT 
INTO sessions(user_id, date_expires)
VALUES ($1, $2) 
RETURNING *;

-- name: FindSession :one
SELECT * FROM sessions where id=$1;

-- name: DeleteSession :exec
DELETE FROM sessions where id=$1;
