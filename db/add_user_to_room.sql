update channels
set "allowed_users" = array_append(allowed_users, $1)
where id = $2;
SELECT * FROM channels