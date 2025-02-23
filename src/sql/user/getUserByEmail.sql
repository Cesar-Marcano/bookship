SELECT id, created_at, email, email_verified, is_2fa_enabled, name, password, role, two_factor_type FROM users WHERE email = $1;
