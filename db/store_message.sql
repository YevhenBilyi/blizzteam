INSERT INTO messages (user_id, message, message_time, channel_id)
VALUES ($1, $2, $3, $4);
SELECT * FROM messages JOIN users ON users.id=messages.user_id WHERE channel_id=$4
ORDER BY message_time