UPDATE book
SET
slug = $2,
title = $3,
author = $4,
description = $5,
genre = $6,
publication_year = $7,
cover_image_url = $8,
file_url = $9
WHERE id = $1
RETURNING *;
