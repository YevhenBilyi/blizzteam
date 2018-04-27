CREATE TABLE IF NOT EXISTS messages (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ,
message TEXT,
message_time TEXT,
channel_id INTEGER REFERENCES channels(id)
)