-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_approved', 'booking_rejected', 'booking_cancelled')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_booking_id ON notifications(booking_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Function to create notification when booking is created
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for the item owner
  INSERT INTO notifications (user_id, booking_id, type, title, message)
  VALUES (
    NEW.owner_id,
    NEW.id,
    'booking_request',
    'New Booking Request',
    'You have received a new booking request for your item.'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new bookings
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION create_booking_notification();

-- Function to create notification when booking status changes
CREATE OR REPLACE FUNCTION create_booking_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status actually changed
  IF OLD.status != NEW.status THEN
    -- Create notification for the renter when status changes
    IF NEW.status = 'confirmed' THEN
      INSERT INTO notifications (user_id, booking_id, type, title, message)
      VALUES (
        NEW.renter_id,
        NEW.id,
        'booking_approved',
        'Booking Approved',
        'Your booking request has been approved by the owner.'
      );
    ELSIF NEW.status = 'cancelled' THEN
      INSERT INTO notifications (user_id, booking_id, type, title, message)
      VALUES (
        NEW.renter_id,
        NEW.id,
        'booking_rejected',
        'Booking Rejected',
        'Your booking request has been rejected by the owner.'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for booking status changes
CREATE TRIGGER on_booking_status_changed
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION create_booking_status_notification();
