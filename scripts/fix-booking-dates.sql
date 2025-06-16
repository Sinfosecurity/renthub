-- Remove start_date and end_date from items table (they don't belong there)
ALTER TABLE items DROP COLUMN IF EXISTS start_date;
ALTER TABLE items DROP COLUMN IF EXISTS end_date;

-- Ensure bookings table has the correct structure
-- (These columns should already exist, but let's make sure)
DO $$ 
BEGIN
    -- Check if start_date column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'start_date') THEN
        ALTER TABLE bookings ADD COLUMN start_date DATE NOT NULL;
    END IF;
    
    -- Check if end_date column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'end_date') THEN
        ALTER TABLE bookings ADD COLUMN end_date DATE NOT NULL;
    END IF;
END $$;

-- Ensure indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_end_date ON bookings(end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_date_range ON bookings(start_date, end_date);
