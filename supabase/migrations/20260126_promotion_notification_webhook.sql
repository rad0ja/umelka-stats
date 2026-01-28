-- Migration: Set up promotion notifications via queue table
-- When a user is promoted from 'queued' to 'yes', insert into a queue for processing

-- Create a table to queue promotion notifications
CREATE TABLE IF NOT EXISTS promotion_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz DEFAULT NULL
);

-- Enable RLS
ALTER TABLE promotion_notifications ENABLE ROW LEVEL SECURITY;

-- Service role can do anything
CREATE POLICY "Service role full access" ON promotion_notifications
  FOR ALL USING (auth.role() = 'service_role');

-- Create a function to queue notification when promotion happens
CREATE OR REPLACE FUNCTION queue_promotion_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger when status changes from 'queued' to 'yes'
  IF OLD.status = 'queued' AND NEW.status = 'yes' THEN
    INSERT INTO promotion_notifications (user_id, event_id)
    VALUES (NEW.user_id, NEW.event_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS queue_promotion_notification_trigger ON event_participants;
CREATE TRIGGER queue_promotion_notification_trigger
AFTER UPDATE ON event_participants
FOR EACH ROW
WHEN (OLD.status = 'queued' AND NEW.status = 'yes')
EXECUTE FUNCTION queue_promotion_notification();
