SELECT *
FROM reports
WHERE report_type = $1
AND ($2::text IS NULL OR report_details % $2)
AND ($3::text IS NULL OR reviewed_by = $3)
AND ($4::text IS NULL OR done = $4)
ORDER BY created_at DESC
LIMIT $5 OFFSET $6;
