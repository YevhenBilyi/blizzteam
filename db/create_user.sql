INSERT INTO users 
(profile_picture, google_id)
VALUES ( $1, $2)
RETURNING *;