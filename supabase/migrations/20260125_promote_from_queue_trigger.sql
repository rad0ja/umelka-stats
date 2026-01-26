-- Create or replace the trigger function with SECURITY DEFINER
-- This allows the function to bypass RLS when promoting queued participants
CREATE OR REPLACE FUNCTION promote_from_queue()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_id uuid;
  current_yes int;
  max_players int;
BEGIN
  -- Determine if this action removed a 'yes' participant:
  IF TG_OP = 'UPDATE' THEN
    -- On update, require OLD.status = 'yes' and NEW.status IS DISTINCT FROM 'yes'
    IF NOT (OLD.status = 'yes' AND NEW.status IS DISTINCT FROM 'yes') THEN
      RETURN NEW;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF NOT (OLD.status = 'yes') THEN
      RETURN OLD;
    END IF;
  ELSE
    -- Only handle UPDATE or DELETE
    RETURN NEW;
  END IF;

  -- Count current 'yes' participants (excluding the removed one if DELETE)
  SELECT count(*) INTO current_yes
  FROM event_participants
  WHERE event_id = OLD.event_id
    AND status = 'yes';

  SELECT max_participants INTO max_players
  FROM events
  WHERE id = OLD.event_id;

  IF current_yes < max_players THEN
    -- Pick the oldest queued participant and lock the row to avoid races
    SELECT id INTO next_id
    FROM event_participants
    WHERE event_id = OLD.event_id
      AND status = 'queued'
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

    IF next_id IS NOT NULL THEN
      UPDATE event_participants
      SET status = 'yes'
      WHERE id = next_id;
    END IF;
  END IF;

  -- Return appropriate row for trigger type
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS promote_queued_participant ON event_participants;

-- Create the trigger to fire after UPDATE or DELETE on event_participants
CREATE TRIGGER promote_queued_participant
AFTER UPDATE OR DELETE ON event_participants
FOR EACH ROW
EXECUTE FUNCTION promote_from_queue();
