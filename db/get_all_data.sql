SELECT * FROM messages JOIN users on users.id=messages.user_id JOIN channels ON channels.id=messages.channel_id
WHERE users.id=$1