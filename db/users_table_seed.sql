CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
google_id TEXT ,
server_num INTEGER ,
battle_tag TEXT DEFAULT '',
profile_picture TEXT DEFAULT '',
mmr INTEGER ,
tier TEXT DEFAULT '',
hero TEXT DEFAULT ''
)