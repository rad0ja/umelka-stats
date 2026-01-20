-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read messages
CREATE POLICY "Authenticated users can read all messages"
    ON chat_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert their own messages"
    ON chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
    ON chat_messages
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable realtime for chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Update push_subscriptions to link to auth.users instead of players
-- First, drop the old foreign key if it exists
ALTER TABLE push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_fkey;

-- Add new foreign key to auth.users
ALTER TABLE push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all subscriptions (needed for sending notifications)
CREATE POLICY "Authenticated users can read all push subscriptions"
    ON push_subscriptions
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Users can insert their own subscriptions
CREATE POLICY "Users can insert their own push subscriptions"
    ON push_subscriptions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can update their own subscriptions
CREATE POLICY "Users can update their own push subscriptions"
    ON push_subscriptions
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete their own push subscriptions"
    ON push_subscriptions
    FOR DELETE
    TO authenticated
    USING (auth.uid()::text = user_id::text);
