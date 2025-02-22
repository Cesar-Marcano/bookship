SELECT id, name, email, created_at, password, role FROM users WHERE email = $1;
