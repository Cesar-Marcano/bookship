SELECT id, name, email, role, is_2fa_enabled FROM users WHERE id = $1;
