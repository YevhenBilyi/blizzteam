UPDATE messages
SET "dislike" = $1
WHERE "user_id"=$2 AND "message_time"=$3;
SELECT * FROM messages JOIN users ON users.id=messages.user_id WHERE channel_id=$4
ORDER BY message_time