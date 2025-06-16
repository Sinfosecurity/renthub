-- Add start_date and end_date columns to items table
ALTER TABLE items 
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;

-- Add indexes for better performance on date queries
CREATE INDEX idx_items_start_date ON items(start_date);
CREATE INDEX idx_items_end_date ON items(end_date);
CREATE INDEX idx_items_date_range ON items(start_date, end_date);

-- Update existing items to have default dates (optional - you can skip this if you want them to be null)
-- UPDATE items SET start_date = CURRENT_DATE, end_date = CURRENT_DATE + INTERVAL '30 days' WHERE start_date IS NULL;
