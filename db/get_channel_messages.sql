SELECT * FROM messages JOIN users ON users.id=messages.user_id WHERE channel_id=$1
ORDER BY message_time