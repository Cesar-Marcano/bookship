UPDATE book_ratings
WHERE id = $1
RETURNING *;
