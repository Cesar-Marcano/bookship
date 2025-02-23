-- Query to filter book by genre or/and author
-- Ordered by average rating (descending)

SELECT b.*, COALESCE(AVG(br.rating), 0) AS average_rating
FROM books b
LEFT JOIN book_ratings br ON b.id = br.book_id
WHERE ($1 IS NULL OR b.genre = $1)  -- Filter by genre
AND ($2 IS NULL OR b.author = $2)  -- Filter by author
GROUP BY b.id
ORDER BY average_rating DESC  -- Order by title similarity and average rating
LIMIT $3 OFFSET $4;  -- Pagination
