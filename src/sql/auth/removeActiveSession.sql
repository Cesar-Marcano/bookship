UPDATE users
SET active_sessions = array_remove(active_sessions, $2)
WHERE id = $1;
