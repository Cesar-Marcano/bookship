SELECT *
FROM sessions
WHERE user_id = $1 AND uuid = $2;
