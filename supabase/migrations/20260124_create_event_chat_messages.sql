-- Create event_chat_messages table for event-specific chat
CREATE TABLE IF NOT EXISTS event_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE event_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Only event participants (yes/tentative) can read messages
CREATE POLICY "Event participants can read messages"
    ON event_chat_messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM event_participants
            WHERE event_participants.event_id = event_chat_messages.event_id
            AND event_participants.user_id = auth.uid()
            AND event_participants.status IN ('yes', 'tentative', 'queued')
        )
    );

-- Policy: Only event participants can insert their own messages
CREATE POLICY "Event participants can insert their own messages"
    ON event_chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM event_participants
            WHERE event_participants.event_id = event_chat_messages.event_id
            AND event_participants.user_id = auth.uid()
            AND event_participants.status IN ('yes', 'tentative', 'queued')
        )
    );

-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete their own event messages"
    ON event_chat_messages
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_chat_messages_event_id
    ON event_chat_messages(event_id);

CREATE INDEX IF NOT EXISTS idx_event_chat_messages_event_created
    ON event_chat_messages(event_id, created_at DESC);

-- Enable realtime for event_chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE event_chat_messages;
