-- Make the first registered user an admin
-- Replace 'your-email@example.com' with your actual email address
UPDATE profiles 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';

-- Or if you want to make the first user (by creation date) an admin:
-- UPDATE profiles 
-- SET is_admin = TRUE 
-- WHERE id = (
--   SELECT id FROM profiles 
--   ORDER BY joined_at ASC 
--   LIMIT 1
-- );

-- Verify the update
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE is_admin = TRUE;
