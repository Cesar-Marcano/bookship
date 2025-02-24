UPDATE comment_votes
SET vote_type = $2
WHERE id = $1;
