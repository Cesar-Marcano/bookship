SELECT id, created_at, email, email_verified, is_2fa_enabled, name, role, two_factor_type FROM users WHERE id = $1;
