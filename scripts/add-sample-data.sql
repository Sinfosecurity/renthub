-- Add some sample items for testing (you'll need to replace owner_id with actual user IDs after signup)
-- First, let's add some sample categories if they don't exist
INSERT INTO categories (name, icon, description) VALUES
('Electronics', '📱', 'Phones, laptops, cameras, and electronic devices'),
('Tools', '🔧', 'Power tools, hand tools, and equipment'),
('Sports', '⚽', 'Sports equipment and outdoor gear'),
('Photography', '📸', 'Cameras, lenses, and photography equipment'),
('Outdoor', '🏕️', 'Camping, hiking, and outdoor adventure gear'),
('Music', '🎵', 'Musical instruments and audio equipment')
ON CONFLICT (name) DO NOTHING;

-- Note: You'll need to add actual items after creating user accounts
-- The items table requires valid owner_id (user UUID) and category_id
