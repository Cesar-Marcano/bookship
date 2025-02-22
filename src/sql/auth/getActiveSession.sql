SELECT id
FROM users
WHERE id = $1 AND $2 = ANY(active_sessions);
