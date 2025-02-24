UPDATE reports
SET
    done = $2,
    reviewed_by = $3
WHERE id = $1
RETURNING *;
