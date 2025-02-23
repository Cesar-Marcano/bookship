-- Migration #0 02/21/2025 - Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration #0 02/22/2025 - Add role column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator', 'creator');
    END IF;
END $$;


ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Migration #1 02/22/2025 - Add active_sessions column (removed in migration #2)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS active_sessions UUID[] DEFAULT ARRAY[]::UUID[];

-- Migration #2 02/22/2025 - Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    uuid UUID NOT NULL,
    user_ip VARCHAR(255) NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

ALTER TABLE users DROP COLUMN IF EXISTS active_sessions;

-- Migration #3 02/22/2025 - Add email verified column into users table and is enabled Two-Factor Authentication column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT TRUE;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'two_factor_type') THEN
        CREATE TYPE two_factor_type AS ENUM ('email', 'authenticator');
    END IF;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_type two_factor_type DEFAULT 'email';

-- Migration #0 02/23/2025 - Add last active column in sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Migration #1 02/23/25 - Create books, books_rating and book comments and comment votes table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    publication_year INTEGER,
    genre VARCHAR(255),
    cover_image_url VARCHAR(255),
    file_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS book_ratings (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS book_comments (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_type') THEN
        CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS comment_votes (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_type vote_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES book_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (comment_id, user_id)
);

-- Migration #2 02/23/2025 - Created table for user saved books
CREATE TABLE IF NOT EXISTS user_saved_books (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE (user_id, book_id)
);

-- Migration #3 02/23/2025 - Add forgotten rating column in book_ratings table
ALTER TABLE book_ratings ADD COLUMN IF NOT EXISTS rating SMALLINT CHECK (rating >= 1 AND rating <= 5) DEFAULT 1;

-- Migration #4 02/23/2025 - Update books table to set NULL constraints
ALTER TABLE books
    ALTER COLUMN cover_image_url DROP NOT NULL,
    ALTER COLUMN file_url DROP NOT NULL;

ALTER TABLE books
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN author SET NOT NULL,
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN genre SET NOT NULL,
    ALTER COLUMN publication_year SET NOT NULL;

ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Migration #5 02/23/2025 - Added slug column in books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS slug VARCHAR(255); -- ADD FORGOTTEN IF NOT EXISTS

UPDATE books SET slug = LOWER(REPLACE(title, ' ', '-')) || '-' || id WHERE slug IS NULL;

ALTER TABLE books ALTER COLUMN slug SET NOT NULL;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'books' 
        AND constraint_name = 'unique_slug'
    ) THEN
        ALTER TABLE books ADD CONSTRAINT unique_slug UNIQUE (slug);
    END IF;
END $$;

-- Migration #6 02/24/2025 - Add ON DELETE CASCADE to foreign keys and enforce NOT NULL on ratings

ALTER TABLE sessions 
DROP CONSTRAINT sessions_user_id_fkey, 
ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_saved_books 
DROP CONSTRAINT user_saved_books_book_id_fkey, 
ADD CONSTRAINT user_saved_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;

ALTER TABLE comment_votes 
DROP CONSTRAINT comment_votes_comment_id_fkey, 
ADD CONSTRAINT comment_votes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES book_comments(id) ON DELETE CASCADE;

ALTER TABLE book_ratings ALTER COLUMN rating SET NOT NULL;
