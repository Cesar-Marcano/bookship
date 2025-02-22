DELETE from users
WHERE id = $1
RETURNING id, name, email, created_at, role;