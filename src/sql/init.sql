-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration #0 02/22/2025 - Add role column
CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator', 'creator');

ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';
