-- Add sample items with different categories to populate charts
DO $$
DECLARE
    user_id UUID;
    categories TEXT[] := ARRAY['Electronics', 'Tools', 'Sports', 'Photography', 'Outdoor', 'Music'];
    category_name TEXT;
    i INTEGER;
BEGIN
    -- Get the first user ID
    SELECT id INTO user_id FROM profiles LIMIT 1;
    
    -- Only proceed if we have a user
    IF user_id IS NOT NULL THEN
        -- Add sample items for each category
        FOREACH category_name IN ARRAY categories
        LOOP
            FOR i IN 1..3 LOOP
                INSERT INTO items (name, description, price, category, owner_id, location, features, is_available)
                VALUES (
                    category_name || ' Item ' || i,
                    'Sample ' || category_name || ' item for testing charts and analytics.',
                    (RANDOM() * 100 + 10)::DECIMAL(10,2),
                    category_name,
                    user_id,
                    'Sample City, ST',
                    ARRAY['Feature 1', 'Feature 2'],
                    TRUE
                );
            END LOOP;
        END LOOP;
        
        -- Add some sample bookings with different statuses
        INSERT INTO bookings (item_id, renter_id, owner_id, start_date, end_date, total_price, status, created_at)
        SELECT 
            i.id,
            user_id,
            i.owner_id,
            CURRENT_DATE + (RANDOM() * 30)::INTEGER,
            CURRENT_DATE + (RANDOM() * 30)::INTEGER + (RANDOM() * 10 + 1)::INTEGER,
            (RANDOM() * 500 + 50)::DECIMAL(10,2),
            CASE (RANDOM() * 4)::INTEGER
                WHEN 0 THEN 'pending'
                WHEN 1 THEN 'confirmed'
                WHEN 2 THEN 'active'
                WHEN 3 THEN 'completed'
                ELSE 'cancelled'
            END,
            NOW() - (RANDOM() * INTERVAL '90 days')
        FROM items i
        WHERE i.owner_id = user_id
        LIMIT 15;
        
        RAISE NOTICE 'Sample data added successfully for charts!';
    ELSE
        RAISE NOTICE 'No users found. Please create a user account first.';
    END IF;
END $$;
