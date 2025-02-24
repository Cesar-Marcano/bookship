SELECT 
    vote_type, 
    COUNT(*) AS count
FROM 
    comment_votes
WHERE 
    comment_id = $1
GROUP BY 
    vote_type;
