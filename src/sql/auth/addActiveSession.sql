UPDATE users
SET active_sessions = array_append(active_sessions, $2)
WHERE id = $1;
