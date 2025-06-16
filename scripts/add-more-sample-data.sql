-- Add more sample data to make charts more visible and interesting
DO $$
DECLARE
    user_id UUID;
    item_ids UUID[];
    categories TEXT[] := ARRAY['Electronics', 'Tools', 'Sports', 'Photography', 'Outdoor', 'Music'];
    statuses TEXT[] := ARRAY['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    category_name TEXT;
    status_name TEXT;
    i INTEGER;
    j INTEGER;
    item_id UUID;
BEGIN
    -- Get the first user ID
    SELECT id INTO user_id FROM profiles LIMIT 1;
    
    -- Only proceed if we have a user
    IF user_id IS NOT NULL THEN
        RAISE NOTICE 'Adding sample data for user: %', user_id;
        
        -- Add more sample items for each category (if not already exists)
        FOREACH category_name IN ARRAY categories
        LOOP
            FOR i IN 1..4 LOOP
                -- Check if item already exists
                IF NOT EXISTS (
                    SELECT 1 FROM items 
                    WHERE name = category_name || ' Item ' || i 
                    AND owner_id = user_id
                ) THEN
                    INSERT INTO items (name, description, price, category, owner_id, location, features, is_available)
                    VALUES (
                        category_name || ' Item ' || i,
                        'Sample ' || category_name || ' item #' || i || ' for testing charts and analytics.',
                        (RANDOM() * 100 + 10)::DECIMAL(10,2),
                        category_name,
                        user_id,
                        'Sample City, ST',
                        ARRAY['Feature 1', 'Feature 2', 'Feature 3'],
                        TRUE
                    );
                END IF;
            END LOOP;
        END LOOP;
        
        -- Get all item IDs for this user
        SELECT ARRAY(SELECT id FROM items WHERE owner_id = user_id) INTO item_ids;
        
        -- Add sample bookings with different statuses and dates
        FOR i IN 1..20 LOOP
            -- Pick a random item
            item_id := item_ids[1 + (RANDOM() * (array_length(item_ids, 1) - 1))::INTEGER];
            
            -- Pick a random status
            status_name := statuses[1 + (RANDOM() * (array_length(statuses, 1) - 1))::INTEGER];
            
            -- Create booking with random dates in the past 6 months
            INSERT INTO bookings (
                item_id, 
                renter_id, 
                owner_id, 
                start_date, 
                end_date, 
                total_price, 
                status, 
                created_at
            )
            VALUES (
                item_id,
                user_id, -- Using same user as renter for simplicity
                user_id, -- Owner
                CURRENT_DATE - (RANDOM() * 180)::INTEGER, -- Random date in last 6 months
                CURRENT_DATE - (RANDOM() * 180)::INTEGER + (RANDOM() * 10 + 1)::INTEGER, -- End date
                (RANDOM() * 500 + 50)::DECIMAL(10,2), -- Random price
                status_name,
                NOW() - (RANDOM() * INTERVAL '180 days') -- Random creation date
            )
            ON CONFLICT DO NOTHING; -- Avoid duplicates
        END LOOP;
        
        -- Add some reviews for completed bookings
        INSERT INTO reviews (item_id, booking_id, reviewer_id, rating, comment)
        SELECT 
            b.item_id,
            b.id,
            b.renter_id,
            (RANDOM() * 4 + 1)::INTEGER, -- Rating 1-5
            'Sample review for testing purposes.'
        FROM bookings b
        WHERE b.status = 'completed'
        AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.id)
        LIMIT 10;
        
        RAISE NOTICE 'Sample data added successfully!';
        RAISE NOTICE 'Items: %', (SELECT COUNT(*) FROM items WHERE owner_id = user_id);
        RAISE NOTICE 'Bookings: %', (SELECT COUNT(*) FROM bookings WHERE owner_id = user_id);
        RAISE NOTICE 'Reviews: %', (SELECT COUNT(*) FROM reviews WHERE reviewer_id = user_id);
        
    ELSE
        RAISE NOTICE 'No users found. Please create a user account first.';
    END IF;
END $$;
