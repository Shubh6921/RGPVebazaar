-- =============================================================================
-- RGPV UNOFFICIAL — STAGE 10: REAL SUPABASE AUTH & ENROLLMENT VERIFICATION
-- =============================================================================

-- 1. Valid Enrollments Table (Official Campus Roster)
CREATE TABLE IF NOT EXISTS public.valid_enrollments (
    enrollment_no text PRIMARY KEY,
    full_name text NOT NULL,
    branch text NOT NULL,
    batch text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valid_enrollments ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated read access for verification checks
DROP POLICY IF EXISTS "Allow public enrollment lookup" ON public.valid_enrollments;
CREATE POLICY "Allow public enrollment lookup"
    ON public.valid_enrollments
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Deny client direct write access to valid_enrollments (Only admins/service role can insert/update)
DROP POLICY IF EXISTS "Deny public modification on valid_enrollments" ON public.valid_enrollments;
CREATE POLICY "Deny public modification on valid_enrollments"
    ON public.valid_enrollments
    FOR ALL
    TO anon, authenticated
    USING (false);

-- 2. Profiles Table (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_no text UNIQUE REFERENCES public.valid_enrollments(enrollment_no),
    full_name text,
    branch text,
    batch text,
    phone text,
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view verified profiles" ON public.profiles;
CREATE POLICY "Public can view verified profiles"
    ON public.profiles
    FOR SELECT
    TO anon, authenticated
    USING (is_verified = true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. Stored RPC: Check Enrollment
CREATE OR REPLACE FUNCTION public.check_enrollment(p_enrollment text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_norm text;
    v_rec record;
BEGIN
    v_norm := UPPER(TRIM(p_enrollment));
    
    IF v_norm IS NULL OR LENGTH(v_norm) < 6 THEN
        RETURN json_build_object('found', false, 'error', 'Invalid enrollment number format');
    END IF;

    SELECT enrollment_no, full_name, branch, batch
    INTO v_rec
    FROM public.valid_enrollments
    WHERE enrollment_no = v_norm;

    IF FOUND THEN
        RETURN json_build_object(
            'found', true,
            'student', json_build_object(
                'enrollment_no', v_rec.enrollment_no,
                'full_name', v_rec.full_name,
                'branch', v_rec.branch,
                'batch', v_rec.batch
            )
        );
    ELSE
        RETURN json_build_object('found', false, 'error', 'Enrollment not found in official campus roster');
    END IF;
END;
$$;

-- Grant execution to anon and authenticated
GRANT EXECUTE ON FUNCTION public.check_enrollment(text) TO anon, authenticated;

-- 4. Initial Seed Data into valid_enrollments
INSERT INTO public.valid_enrollments (enrollment_no, full_name, branch, batch)
VALUES
    ('0101CS261001', 'Rahul Sharma', 'Computer Science & Engineering', '2026–30'),
    ('0101IT251042', 'Priya Patel', 'Information Technology', '2025–29'),
    ('0101EC241018', 'Amit Verma', 'Electronics & Communication', '2024–28'),
    ('0101ME261055', 'Sneha Gupta', 'Mechanical Engineering', '2026–30'),
    ('0101CS251088', 'Shubham Verma', 'Computer Science & Engineering', '2025–29'),
    ('0101CE241012', 'Arjun Singh', 'Civil Engineering', '2024–28')
ON CONFLICT (enrollment_no) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    branch = EXCLUDED.branch,
    batch = EXCLUDED.batch;

-- 5. Stored RPC: Complete Verification & Copy Profile Data
CREATE OR REPLACE FUNCTION public.complete_verification(
    p_enrollment text,
    p_phone text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_norm text;
    v_student record;
    v_existing_profile record;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Authentication required.');
    END IF;

    v_norm := UPPER(TRIM(p_enrollment));
    SELECT * INTO v_student FROM public.valid_enrollments WHERE enrollment_no = v_norm;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Enrollment number not found in campus roster.');
    END IF;

    -- Check if enrollment is already registered to another user account
    SELECT * INTO v_existing_profile FROM public.profiles WHERE enrollment_no = v_norm AND id <> v_user_id;
    IF FOUND THEN
        RETURN json_build_object('success', false, 'error', 'This enrollment number is already registered to another student account.');
    END IF;

    -- Upsert profile with matched roster data
    INSERT INTO public.profiles (id, enrollment_no, full_name, branch, batch, phone, is_verified, updated_at)
    VALUES (
        v_user_id,
        v_norm,
        v_student.full_name,
        v_student.branch,
        v_student.batch,
        COALESCE(p_phone, (SELECT phone FROM auth.users WHERE id = v_user_id)),
        true,
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        enrollment_no = EXCLUDED.enrollment_no,
        full_name = EXCLUDED.full_name,
        branch = EXCLUDED.branch,
        batch = EXCLUDED.batch,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        is_verified = true,
        updated_at = now();

    RETURN json_build_object(
        'success', true,
        'profile', json_build_object(
            'id', v_user_id,
            'enrollment_no', v_norm,
            'full_name', v_student.full_name,
            'branch', v_student.branch,
            'batch', v_student.batch,
            'phone', COALESCE(p_phone, (SELECT phone FROM auth.users WHERE id = v_user_id)),
            'is_verified', true
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_verification(text, text) TO authenticated;

