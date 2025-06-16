-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create an index for better performance on admin queries
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin);

-- Update the handle_new_user function to include is_admin field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    FALSE  -- Default to false for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Make the first user an admin (you can run this after creating your account)
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';

-- Optional: Create a dedicated admin account
-- You can uncomment and modify this if you want to create a default admin account
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   'admin@renthub.com',
--   crypt('admin123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- );
