-- ==============================================================================
-- RGPVEBAZAAR — CHAT & REALTIME MESSAGING SCHEMA
-- Tables: conversations, conversation_participants, messages
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    last_message_text TEXT,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    unread_count INT DEFAULT 0,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL CHECK (LENGTH(TRIM(content)) > 0 AND LENGTH(content) <= 2000),
    attachments JSONB DEFAULT '[]'::jsonb,
    client_message_id TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON public.messages(conversation_id, client_message_id);
CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- Enable Supabase Realtime Publication
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

-- Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;
CREATE POLICY "Participants can view conversations"
ON public.conversations FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = conversations.id
    )
);

DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
CREATE POLICY "Users can insert conversations"
ON public.conversations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can update conversations" ON public.conversations;
CREATE POLICY "Participants can update conversations"
ON public.conversations FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view conversation participants" ON public.conversation_participants;
CREATE POLICY "Public can view conversation participants"
ON public.conversation_participants FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert participants" ON public.conversation_participants;
CREATE POLICY "Users can insert participants"
ON public.conversation_participants FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own participant info" ON public.conversation_participants;
CREATE POLICY "Users can update own participant info"
ON public.conversation_participants FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
    )
);

DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT
TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = messages.conversation_id
    )
);

DROP POLICY IF EXISTS "Participants can update messages" ON public.messages;
CREATE POLICY "Participants can update messages"
ON public.messages FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
