SELECT id
FROM users
WHERE id = $1 AND $2 IN (SELECT unnest(active_sessions));