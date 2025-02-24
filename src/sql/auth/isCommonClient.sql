-- Query to verify if the Client UUID or User Agent is recognized for a given user.
-- This helps determine whether the login attempt is coming from a known device or browser.
UPDATE sessions
SET 
    disabled_session = CASE 
        WHEN client_uuid <> $1 AND disabled_session = FALSE THEN TRUE
        ELSE disabled_session 
    END,
    possibly_insecure = CASE 
        WHEN client_uuid = $1 AND user_agent <> $2 AND disabled_session = FALSE THEN TRUE  
        ELSE possibly_insecure 
    END
WHERE uuid = $3 AND user_id = $4
AND (client_uuid <> $1 OR user_agent <> $2 OR disabled_session = FALSE)
RETURNING possibly_insecure, disabled_session;

