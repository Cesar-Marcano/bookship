SELECT id, name, email, created_at, password, role, is_2fa_enabled FROM users WHERE email = $1;
