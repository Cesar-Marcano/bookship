UPDATE book_ratings
SET rating = $2
WHERE id = $1
RETURNING *;
