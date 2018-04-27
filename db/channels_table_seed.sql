CREATE TABLE IF NOT EXISTS channels (
id SERIAL PRIMARY KEY,
tier TEXT,
allowed_users INTEGER ARRAY[5],
channel TEXT
)