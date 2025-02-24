SELECT * FROM book_ratings
WHERE book_id = $1
AND ($2::text IS NULL OR user_id = $2);
