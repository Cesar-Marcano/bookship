UPDATE book_comments
SET comment = $2
WHERE id = $1;
RETURNING *;
