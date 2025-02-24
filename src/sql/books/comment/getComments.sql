SELECT * FROM book_comments
WHERE book_id = $1
AND ($2::text IS NULL OR user_id = $2)
AND ($3::text IS NULL OR comment % $3);
