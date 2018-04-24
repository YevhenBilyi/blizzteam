CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
google_id TEXT,
server_num INTEGER,
battle_tag TEXT,
profile_picture TEXT,
mmr INTEGER,
tier TEXT
)