UPDATE users
SET name = $2,
    email = $3,
    password = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING id, name, email, created_at;
