-- Drop existing tables and recreate with simplified structure
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create simplified items table with category as text field
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  image TEXT, -- Single image URL instead of array
  features TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_items_available ON items(is_available);
CREATE INDEX idx_bookings_item ON bookings(item_id);
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
CREATE INDEX idx_bookings_owner ON bookings(owner_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_reviews_item ON reviews(item_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for items table
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Items policies
CREATE POLICY "Items are viewable by everyone" ON items
FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert their own items" ON items
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own items" ON items
FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own items" ON items
FOR DELETE USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create bookings" ON bookings
FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners can update booking status" ON bookings
FOR UPDATE USING (auth.uid() = owner_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON reviews
FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_id 
    AND bookings.renter_id = auth.uid()
    AND bookings.status = 'completed'
  )
);

-- Insert some sample items for testing
INSERT INTO items (name, description, price, category, owner_id, location, image, features) VALUES
('Professional Camera Kit', 'Complete professional camera kit including Canon EOS R5, multiple lenses, tripod, lighting equipment, and carrying case.', 45.00, 'Photography', (SELECT id FROM profiles LIMIT 1), 'San Francisco, CA', '/placeholder.svg?height=400&width=600', ARRAY['Canon EOS R5 Camera Body', '24-70mm f/2.8L Lens', '70-200mm f/2.8L Lens', 'Professional Tripod', 'LED Light Panel']),
('Mountain Bike', 'High-quality mountain bike perfect for trail riding and outdoor adventures.', 25.00, 'Sports', (SELECT id FROM profiles LIMIT 1), 'Oakland, CA', '/placeholder.svg?height=400&width=600', ARRAY['21-speed transmission', 'Front suspension', 'Disc brakes', 'Helmet included']),
('Power Drill Set', 'Complete power drill set with various bits and accessories for home improvement projects.', 15.00, 'Tools', (SELECT id FROM profiles LIMIT 1), 'San Jose, CA', '/placeholder.svg?height=400&width=600', ARRAY['Cordless drill', 'Drill bits set', 'Screwdriver bits', 'Carrying case']),
('Gaming Console', 'Latest gaming console with controllers and popular games included.', 35.00, 'Electronics', (SELECT id FROM profiles LIMIT 1), 'Berkeley, CA', '/placeholder.svg?height=400&width=600', ARRAY['Console', '2 Controllers', '5 Popular Games', 'HDMI Cable']);
