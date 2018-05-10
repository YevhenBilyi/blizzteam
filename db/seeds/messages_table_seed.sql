CREATE TABLE IF NOT EXISTS messages (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ,
message TEXT,
message_time TEXT,
channel_id INTEGER REFERENCES channels(id),
like INTEGER DEFAULT 0,
dislike INTEGER DEFAULT 0
)