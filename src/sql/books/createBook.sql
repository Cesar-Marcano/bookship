INSERT INTO books (slug, title, author, description, genre, publication_year, added_by, cover_image_url, file_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
