-- ==============================================================================
-- RGPVEBAZAAR — CAMPUS ADMIN & CLUB PRESIDENT MANAGEMENT SYSTEM
-- Migration: 20260907_campus_admin_club_management.sql
-- Database: PostgreSQL / Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. EXTEND PROFILES TABLE WITH SECURE ROLE ENUM/CHECK
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS role VARCHAR(30) NOT NULL DEFAULT 'STUDENT'
    CHECK (role IN ('STUDENT', 'CLUB_PRESIDENT', 'SUPER_ADMIN'));

-- Index on role for fast role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Mass assignment protection: Ordinary users cannot alter their own role or verification status
CREATE OR REPLACE FUNCTION public.protect_profile_role_and_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- If executed by an ordinary authenticated user (not service_role or security definer)
    IF CURRENT_USER <> 'postgres' AND (current_setting('request.jwt.claim.role', true) = 'authenticated') THEN
        -- Prevent privilege escalation
        IF OLD.role IS DISTINCT FROM NEW.role THEN
            RAISE EXCEPTION 'Privilege escalation rejected: Role can only be assigned by campus administrator.';
        END IF;
        IF OLD.is_verified IS DISTINCT FROM NEW.is_verified AND OLD.is_verified = false AND NEW.is_verified = true THEN
            RAISE EXCEPTION 'Verification status cannot be self-assigned.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role_and_verification();

-- 3. CLUBS TABLE
CREATE TABLE IF NOT EXISTS public.clubs (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    logo TEXT,
    cover_image TEXT,
    category VARCHAR(50) NOT NULL,
    president_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    contact_email TEXT,
    website_url TEXT,
    instagram_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clubs_president ON public.clubs(president_id);
CREATE INDEX IF NOT EXISTS idx_clubs_category ON public.clubs(category);
CREATE INDEX IF NOT EXISTS idx_clubs_is_active ON public.clubs(is_active);

-- 4. CLUB MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.club_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_club_member UNIQUE (club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_club_members_user ON public.club_members(user_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club ON public.club_members(club_id);

-- 5. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(title)) >= 3),
    description TEXT NOT NULL,
    poster_image TEXT,
    category VARCHAR(50) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ,
    registration_url TEXT,
    max_participants INT NOT NULL DEFAULT 100 CHECK (max_participants > 0),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' 
        CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
    rejection_reason TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_event_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- 6. OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(title)) >= 3),
    description TEXT NOT NULL,
    organization VARCHAR(100) NOT NULL,
    image TEXT,
    category VARCHAR(50) NOT NULL,
    eligibility TEXT,
    location VARCHAR(150),
    deadline TIMESTAMPTZ NOT NULL,
    application_url TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PUBLISHED'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'EXPIRED', 'ARCHIVED')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(title)) >= 3),
    message TEXT NOT NULL,
    image TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL'
        CHECK (priority IN ('NORMAL', 'IMPORTANT', 'URGENT')),
    target_audience VARCHAR(30) NOT NULL DEFAULT 'ALL_STUDENTS'
        CHECK (target_audience IN ('ALL_STUDENTS', 'CLUB_MEMBERS', 'SPECIFIC_CLUB', 'CAMPUS_WIDE')),
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'EXPIRED', 'ARCHIVED')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_club ON public.announcements(club_id);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at DESC);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    related_event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    related_opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    related_club_id TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    related_announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 9. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    CONSTRAINT unq_event_registration UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_reg_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON public.event_registrations(user_id);

-- 10. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_bookmark_target CHECK (
        (event_id IS NOT NULL AND opportunity_id IS NULL) OR
        (event_id IS NULL AND opportunity_id IS NOT NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS unq_bookmark_event ON public.bookmarks(user_id, event_id) WHERE event_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS unq_bookmark_opp ON public.bookmarks(user_id, opportunity_id) WHERE opportunity_id IS NOT NULL;

-- 11. CLUB FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.club_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_club_follow UNIQUE (user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_club_follows_user ON public.club_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_club_follows_club ON public.club_follows(club_id);

-- 12. CLUB PRESIDENT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.club_president_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_president_req_status ON public.club_president_requests(status);
CREATE INDEX IF NOT EXISTS idx_president_req_user ON public.club_president_requests(user_id);

-- 13. ADMIN AUDIT LOG TABLE (STRICTLY IMMUTABLE)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON public.admin_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON public.admin_audit_logs(resource_type, resource_id);

-- Prevent any modification or deletion of audit logs
CREATE OR REPLACE FUNCTION public.deny_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are strictly immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_immutable_audit_logs ON public.admin_audit_logs;
CREATE TRIGGER trg_immutable_audit_logs
BEFORE UPDATE OR DELETE ON public.admin_audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.deny_audit_modification();

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function: Check if current user is SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: Check if current user is president of given club
CREATE OR REPLACE FUNCTION public.is_club_president(p_club_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.clubs 
        WHERE id = p_club_id AND president_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- CLUBS RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active clubs" ON public.clubs;
CREATE POLICY "Public can view active clubs"
    ON public.clubs FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_super_admin() OR president_id = auth.uid());

DROP POLICY IF EXISTS "Only Super Admin can insert clubs" ON public.clubs;
CREATE POLICY "Only Super Admin can insert clubs"
    ON public.clubs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin and Club President can update club" ON public.clubs;
CREATE POLICY "Super Admin and Club President can update club"
    ON public.clubs FOR UPDATE
    TO authenticated
    USING (public.is_super_admin() OR president_id = auth.uid())
    WITH CHECK (public.is_super_admin() OR president_id = auth.uid());

DROP POLICY IF EXISTS "Only Super Admin can delete clubs" ON public.clubs;
CREATE POLICY "Only Super Admin can delete clubs"
    ON public.clubs FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- EVENTS RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read published events or own club events or super admin" ON public.events;
CREATE POLICY "Read published events or own club events or super admin"
    ON public.events FOR SELECT
    TO anon, authenticated
    USING (
        status = 'PUBLISHED' 
        OR public.is_super_admin() 
        OR public.is_club_president(club_id)
        OR created_by = auth.uid()
    );

DROP POLICY IF EXISTS "Club President or Super Admin can insert events" ON public.events;
CREATE POLICY "Club President or Super Admin can insert events"
    ON public.events FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin() 
        OR (public.is_club_president(club_id) AND status IN ('DRAFT', 'PENDING_APPROVAL'))
    );

DROP POLICY IF EXISTS "Club President can update own club events; Admin can update all" ON public.events;
CREATE POLICY "Club President can update own club events; Admin can update all"
    ON public.events FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin() 
        OR (public.is_club_president(club_id) AND status <> 'PUBLISHED')
    )
    WITH CHECK (
        public.is_super_admin() 
        OR (public.is_club_president(club_id) AND status IN ('DRAFT', 'PENDING_APPROVAL', 'CANCELLED'))
    );

DROP POLICY IF EXISTS "Super Admin can delete events" ON public.events;
CREATE POLICY "Super Admin can delete events"
    ON public.events FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- OPPORTUNITIES RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published opportunities" ON public.opportunities;
CREATE POLICY "Public can view published opportunities"
    ON public.opportunities FOR SELECT
    TO anon, authenticated
    USING (status = 'PUBLISHED' OR public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin can insert opportunities" ON public.opportunities;
CREATE POLICY "Super Admin can insert opportunities"
    ON public.opportunities FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin can update opportunities" ON public.opportunities;
CREATE POLICY "Super Admin can update opportunities"
    ON public.opportunities FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin can delete opportunities" ON public.opportunities;
CREATE POLICY "Super Admin can delete opportunities"
    ON public.opportunities FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- ANNOUNCEMENTS RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published announcements" ON public.announcements;
CREATE POLICY "Public can view published announcements"
    ON public.announcements FOR SELECT
    TO anon, authenticated
    USING (status = 'PUBLISHED' OR public.is_super_admin() OR (club_id IS NOT NULL AND public.is_club_president(club_id)));

DROP POLICY IF EXISTS "Super Admin or Club President can insert announcements" ON public.announcements;
CREATE POLICY "Super Admin or Club President can insert announcements"
    ON public.announcements FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin() 
        OR (club_id IS NOT NULL AND public.is_club_president(club_id))
    );

DROP POLICY IF EXISTS "Super Admin or Club President can update announcements" ON public.announcements;
CREATE POLICY "Super Admin or Club President can update announcements"
    ON public.announcements FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin() 
        OR (club_id IS NOT NULL AND public.is_club_president(club_id))
    );

DROP POLICY IF EXISTS "Super Admin or Club President can delete announcements" ON public.announcements;
CREATE POLICY "Super Admin or Club President can delete announcements"
    ON public.announcements FOR DELETE
    TO authenticated
    USING (
        public.is_super_admin() 
        OR (club_id IS NOT NULL AND public.is_club_president(club_id))
    );

-- NOTIFICATIONS RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users can update read status of own notifications" ON public.notifications;
CREATE POLICY "Users can update read status of own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (recipient_id = auth.uid())
    WITH CHECK (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users or system can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users or system can insert notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- EVENT REGISTRATIONS RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own registrations; Organizers and Admins can view for event" ON public.event_registrations;
CREATE POLICY "Users can view their own registrations; Organizers and Admins can view for event"
    ON public.event_registrations FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() 
        OR public.is_super_admin() 
        OR EXISTS (
            SELECT 1 FROM public.events e 
            JOIN public.clubs c ON e.club_id = c.id 
            WHERE e.id = event_id AND c.president_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can register for published events" ON public.event_registrations;
CREATE POLICY "Students can register for published events"
    ON public.event_registrations FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.events 
            WHERE id = event_id AND status = 'PUBLISHED'
        )
    );

DROP POLICY IF EXISTS "Users can cancel their own registrations" ON public.event_registrations;
CREATE POLICY "Users can cancel their own registrations"
    ON public.event_registrations FOR DELETE
    TO authenticated
    USING (user_id = auth.uid() OR public.is_super_admin());

-- BOOKMARKS RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;
CREATE POLICY "Users manage own bookmarks"
    ON public.bookmarks FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- CLUB FOLLOWS RLS
ALTER TABLE public.club_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own club follows" ON public.club_follows;
CREATE POLICY "Users manage own club follows"
    ON public.club_follows FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- PRESIDENT REQUESTS RLS
ALTER TABLE public.club_president_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own requests; Super Admin views all" ON public.club_president_requests;
CREATE POLICY "Users can view own requests; Super Admin views all"
    ON public.club_president_requests FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Students can submit president request" ON public.club_president_requests;
CREATE POLICY "Students can submit president request"
    ON public.club_president_requests FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Only Super Admin can update president requests" ON public.club_president_requests;
CREATE POLICY "Only Super Admin can update president requests"
    ON public.club_president_requests FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- AUDIT LOGS RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only Super Admin can read audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only Super Admin can read audit logs"
    ON public.admin_audit_logs FOR SELECT
    TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Privileged users can write audit logs" ON public.admin_audit_logs;
CREATE POLICY "Privileged users can write audit logs"
    ON public.admin_audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- ==============================================================================
-- 15. PRIVILEGED SERVER-SIDE STORED PROCEDURES (SECURITY DEFINER)
-- ==============================================================================

-- Stored RPC: Approve President Request
CREATE OR REPLACE FUNCTION public.approve_president_request(p_request_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_req RECORD;
    v_reviewer_id UUID;
BEGIN
    v_reviewer_id := auth.uid();
    
    -- Verify reviewer is super admin
    IF NOT public.is_super_admin() THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: Only Super Admin can approve president requests.');
    END IF;

    SELECT * INTO v_req FROM public.club_president_requests WHERE id = p_request_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'President request not found.');
    END IF;

    IF v_req.status <> 'PENDING' THEN
        RETURN json_build_object('success', false, 'error', 'Request is not pending.');
    END IF;

    -- Update request status
    UPDATE public.club_president_requests
    SET status = 'APPROVED',
        reviewed_by = v_reviewer_id,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_request_id;

    -- Elevate user profile role
    UPDATE public.profiles
    SET role = 'CLUB_PRESIDENT',
        updated_at = NOW()
    WHERE id = v_req.user_id;

    -- Assign user as president of requested club
    UPDATE public.clubs
    SET president_id = v_req.user_id,
        updated_at = NOW()
    WHERE id = v_req.requested_club_id;

    -- Add to club members as President
    INSERT INTO public.club_members (club_id, user_id, role)
    VALUES (v_req.requested_club_id, v_req.user_id, 'PRESIDENT')
    ON CONFLICT (club_id, user_id) DO UPDATE SET role = 'PRESIDENT';

    -- Create audit log
    INSERT INTO public.admin_audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_reviewer_id,
        'APPROVE_PRESIDENT_REQUEST',
        'CLUB_PRESIDENT_REQUEST',
        p_request_id::TEXT,
        json_build_object('target_user_id', v_req.user_id, 'club_id', v_req.requested_club_id)
    );

    -- Create notification for student
    INSERT INTO public.notifications (recipient_id, sender_id, type, title, message, related_club_id)
    VALUES (
        v_req.user_id,
        v_reviewer_id,
        'PRESIDENT_REQUEST_APPROVED',
        'President Access Approved! 🎉',
        'Your request to become Club President has been approved by the Campus Admin.',
        v_req.requested_club_id
    );

    RETURN json_build_object('success', true, 'message', 'President request approved successfully.');
END;
$$;

-- Stored RPC: Reject President Request
CREATE OR REPLACE FUNCTION public.reject_president_request(p_request_id UUID, p_rejection_reason TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_req RECORD;
    v_reviewer_id UUID;
BEGIN
    v_reviewer_id := auth.uid();
    
    IF NOT public.is_super_admin() THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: Super Admin access required.');
    END IF;

    SELECT * INTO v_req FROM public.club_president_requests WHERE id = p_request_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Request not found.');
    END IF;

    UPDATE public.club_president_requests
    SET status = 'REJECTED',
        reviewed_by = v_reviewer_id,
        reviewed_at = NOW(),
        rejection_reason = p_rejection_reason,
        updated_at = NOW()
    WHERE id = p_request_id;

    INSERT INTO public.admin_audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_reviewer_id,
        'REJECT_PRESIDENT_REQUEST',
        'CLUB_PRESIDENT_REQUEST',
        p_request_id::TEXT,
        json_build_object('target_user_id', v_req.user_id, 'reason', p_rejection_reason)
    );

    INSERT INTO public.notifications (recipient_id, sender_id, type, title, message, related_club_id)
    VALUES (
        v_req.user_id,
        v_reviewer_id,
        'PRESIDENT_REQUEST_REJECTED',
        'President Request Update',
        COALESCE(p_rejection_reason, 'Your request for club leadership was not approved at this time.'),
        v_req.requested_club_id
    );

    RETURN json_build_object('success', true);
END;
$$;

-- Stored RPC: Revoke President Access
CREATE OR REPLACE FUNCTION public.revoke_president_access(p_user_id UUID, p_club_id TEXT, p_reason TEXT DEFAULT 'Revoked by Campus Admin')
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_reviewer_id UUID;
BEGIN
    v_reviewer_id := auth.uid();

    IF NOT public.is_super_admin() THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: Super Admin access required.');
    END IF;

    -- Remove president from club
    UPDATE public.clubs
    SET president_id = NULL,
        updated_at = NOW()
    WHERE id = p_club_id AND president_id = p_user_id;

    -- Reset user role back to STUDENT
    UPDATE public.profiles
    SET role = 'STUDENT',
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Update member role
    UPDATE public.club_members
    SET role = 'MEMBER'
    WHERE club_id = p_club_id AND user_id = p_user_id;

    -- Audit log
    INSERT INTO public.admin_audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
        v_reviewer_id,
        'REVOKE_PRESIDENT_ACCESS',
        'CLUB',
        p_club_id,
        json_build_object('user_id', p_user_id, 'reason', p_reason)
    );

    -- Notify user
    INSERT INTO public.notifications (recipient_id, sender_id, type, title, message, related_club_id)
    VALUES (
        p_user_id,
        v_reviewer_id,
        'CLUB_UPDATE',
        'Club Leadership Update',
        'Your Club President privileges have been revoked by the Campus Admin.',
        p_club_id
    );

    RETURN json_build_object('success', true);
END;
$$;

-- Stored RPC: Safe Event Registration
CREATE OR REPLACE FUNCTION public.register_for_event(p_event_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_event RECORD;
    v_current_count INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Authentication required.');
    END IF;

    SELECT * INTO v_event FROM public.events WHERE id = p_event_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Event not found.');
    END IF;

    IF v_event.status <> 'PUBLISHED' THEN
        RETURN json_build_object('success', false, 'error', 'Event is not open for registration.');
    END IF;

    IF v_event.registration_deadline IS NOT NULL AND v_event.registration_deadline < NOW() THEN
        RETURN json_build_object('success', false, 'error', 'Registration deadline has passed.');
    END IF;

    -- Check capacity
    SELECT COUNT(*) INTO v_current_count FROM public.event_registrations WHERE event_id = p_event_id;
    IF v_current_count >= v_event.max_participants THEN
        RETURN json_build_object('success', false, 'error', 'Event is already at maximum capacity.');
    END IF;

    -- Insert registration (Unique constraint prevents duplicates)
    BEGIN
        INSERT INTO public.event_registrations (event_id, user_id)
        VALUES (p_event_id, v_user_id);
    EXCEPTION WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'You are already registered for this event.');
    END;

    -- Send confirmation notification
    INSERT INTO public.notifications (recipient_id, type, title, message, related_event_id, related_club_id)
    VALUES (
        v_user_id,
        'REGISTRATION_CONFIRMATION',
        'Registration Confirmed! 🎟️',
        'You have successfully registered for ' || v_event.title || ' at ' || v_event.venue || '.',
        p_event_id,
        v_event.club_id
    );

    RETURN json_build_object('success', true, 'message', 'Registration confirmed successfully!');
END;
$$;

-- ==============================================================================
-- 16. SEED OFFICIAL CLUBS & TEST DATA
-- ==============================================================================

INSERT INTO public.clubs (id, name, description, logo, cover_image, category, contact_email, website_url, instagram_url)
VALUES
    (
        'coding-club',
        'Coding Club RGPV',
        'The premier technical student organization at RGPV dedicated to competitive programming, open source development, web3, and hackathons.',
        '💻',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
        'Technical',
        'coding@rgpv.ac.in',
        'https://codingclubrgpv.in',
        'https://instagram.com/codingclub_rgpv'
    ),
    (
        'robotics-club',
        'Robotics & Automation Society',
        'Hands-on engineering hub exploring embedded systems, IoT, drones, humanoid robotics, and autonomous systems for national competitions.',
        '🤖',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
        'Technical',
        'robotics@rgpv.ac.in',
        'https://roboticsrgpv.org',
        'https://instagram.com/robotics_rgpv'
    ),
    (
        'ecell-rgpv',
        'Entrepreneurship Cell (E-Cell)',
        'Empowering student founders and building campus startups through mentorship, seed funding, venture pitching, and business competitions.',
        '💡',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80',
        'Entrepreneurship',
        'ecell@rgpv.ac.in',
        'https://ecellrgpv.org',
        'https://instagram.com/ecell_rgpv'
    ),
    (
        'cultural-club',
        'Aakriti Cultural Society',
        'Celebrating music, dance, dramatic arts, photography, and campus cultural festivals across all branches and batches.',
        '🎭',
        'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=1200&auto=format&fit=crop&q=80',
        'Cultural',
        'cultural@rgpv.ac.in',
        'https://aakritirgpv.org',
        'https://instagram.com/aakriti_rgpv'
    ),
    (
        'sports-club',
        'RGPV Athletic & Sports Club',
        'Promoting physical fitness, inter-college tournaments, cricket, football, volleyball, badminton, and track athletics.',
        '🏆',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
        'Sports',
        'sports@rgpv.ac.in',
        'https://sportsrgpv.org',
        'https://instagram.com/sports_rgpv'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    logo = EXCLUDED.logo,
    cover_image = EXCLUDED.cover_image;

-- Seed Opportunities
INSERT INTO public.opportunities (title, description, organization, category, eligibility, location, deadline, application_url, status)
VALUES
    (
        'Smart Campus AI Hackathon 2026',
        '36-hour offline hackathon creating AI, IoT, and green campus utilities for university students with direct seed incubation.',
        'Coding Club & Tech Society',
        'Hackathon',
        'All enrolled RGPV students (Teams of 2-4)',
        'Main Auditorium / Central Lab',
        NOW() + INTERVAL '14 days',
        'https://unstop.com/hackathons/rgpv-smart-campus-2026',
        'PUBLISHED'
    ),
    (
        'E-Cell Campus Innovation Challenge',
        'Pitch early-stage business models to alumni venture investors and angel networks. Winning startups receive non-dilutive seed grants.',
        'Entrepreneurship Cell',
        'Competition',
        'Undergraduate & PG students with startup prototypes',
        'Seminar Hall 2, Academic Block 1',
        NOW() + INTERVAL '21 days',
        'https://ecellrgpv.org/innovation-challenge-2026',
        'PUBLISHED'
    ),
    (
        'Google Summer Research Internship 2026',
        'Sponsored summer research internship in computer vision, deep learning, and distributed systems.',
        'Google Research India',
        'Internship',
        '3rd and 4th year B.Tech students with CGPA >= 7.5',
        'Bengaluru / Remote',
        NOW() + INTERVAL '30 days',
        'https://careers.google.com/students',
        'PUBLISHED'
    )
ON CONFLICT DO NOTHING;

-- Grant execution permissions on RPCs to anon and authenticated
GRANT EXECUTE ON FUNCTION public.approve_president_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_president_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_president_access(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_for_event(UUID) TO authenticated;
