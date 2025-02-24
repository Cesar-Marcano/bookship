INSERT INTO book_ratings (book_id, user_id, rating) VALUES ($1, $2, $3) RETURNING id;
