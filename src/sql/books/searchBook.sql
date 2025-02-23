-- Query for book search by title
-- Ordered by average rating (descending)
-- Uses trigrams for approximate matching

CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT b.*, COALESCE(AVG(br.rating), 0) AS average_rating
FROM books b
LEFT JOIN book_ratings br ON b.id = br.book_id
WHERE b.title % $1  -- Fuzzy search by title using trigrams
AND ($2 IS NULL OR b.genre = $2)  -- Filter by genre
AND ($3 IS NULL OR b.author = $3)  -- Filter by author
GROUP BY b.id
ORDER BY b.title <-> $1, average_rating DESC  -- Order by title similarity and average rating
LIMIT $4 OFFSET $5;  -- Pagination
