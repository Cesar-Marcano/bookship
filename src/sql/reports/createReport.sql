INSERT INTO reports (user_id, report_type, book_id, book_comment_id, report_details) VALUES ($1, $2, $3, $4, $5) RETURNING id;
