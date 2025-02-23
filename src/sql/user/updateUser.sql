UPDATE users
SET name = $2,
    email = $3,
    password = $4,
    email_verified = $5,
    is_2fa_enabled = $6,
    role = $7,
    two_factor_type = $8,
    updated_at = NOW()
WHERE id = $1
RETURNING id, created_at, email, email_verified, is_2fa_enabled, name, role, two_factor_type;
