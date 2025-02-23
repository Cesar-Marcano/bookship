UPDATE sessions
SET last_active = NOW()
WHERE uuid = $1
RETURNING *;