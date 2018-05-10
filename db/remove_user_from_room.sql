update channels
set "allowed_users" = array_remove(allowed_users, $1)
where id = $2;
SELECT * FROM channels