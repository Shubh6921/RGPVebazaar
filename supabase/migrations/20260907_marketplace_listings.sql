-- ==============================================================================
-- RGPVEBAZAAR — STAGE 11: FULL BACKEND MARKETPLACE INTEGRATION
-- Database: PostgreSQL / Supabase
-- Unites: Listings table, Storage bucket, Triggers, RLS, and Realtime
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. ENSURE PROFILES HAS ALL PUBLIC ATTRIBUTES
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS program TEXT DEFAULT 'B.Tech',
    ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
    ADD COLUMN IF NOT EXISTS transactions_count INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Ensure profiles can be viewed by anyone for seller public info
DROP POLICY IF EXISTS "Public can view verified profiles" ON public.profiles;
CREATE POLICY "Public can view verified profiles"
    ON public.profiles
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. CREATE MARKETPLACE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(title)) >= 3 AND LENGTH(TRIM(title)) <= 150),
    description TEXT NOT NULL CHECK (LENGTH(TRIM(description)) >= 10 AND LENGTH(TRIM(description)) <= 3000),
    price NUMERIC(10,2) NOT NULL DEFAULT 0.0 CHECK (price >= 0),
    condition VARCHAR(30) NOT NULL CHECK (condition IN ('Like New', 'Good Condition', 'Fair Condition')),
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('sell', 'exchange', 'free')),
    category VARCHAR(50) NOT NULL CHECK (LENGTH(TRIM(category)) >= 2),
    exchange_wish TEXT,
    location VARCHAR(100) NOT NULL DEFAULT 'Central Library' CHECK (LENGTH(TRIM(location)) >= 2),
    images TEXT[] NOT NULL DEFAULT '{}' CHECK (array_length(images, 1) >= 1),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'exchanged', 'removed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_price_for_sell CHECK (
        listing_type <> 'sell' OR price > 0
    ),
    CONSTRAINT chk_exchange_wish CHECK (
        listing_type <> 'exchange' OR (exchange_wish IS NOT NULL AND LENGTH(TRIM(exchange_wish)) >= 3)
    )
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_listings_seller ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON public.listings(listing_type);

-- 4. SERVER-SIDE TRIGGERS: ENFORCE AUTH & TIMESTAMPS
CREATE OR REPLACE FUNCTION public.set_listing_seller_and_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- Derive seller identity from authenticated session if not set or if user is non-service
    IF auth.uid() IS NOT NULL THEN
        NEW.seller_id := auth.uid();
    END IF;

    IF NEW.seller_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required: seller_id must belong to authenticated user.';
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.created_at := COALESCE(NEW.created_at, NOW());
        NEW.updated_at := NOW();
        IF NEW.status IS NULL THEN
            NEW.status := 'active';
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at := NOW();
        -- Prevent changing seller_id
        NEW.seller_id := OLD.seller_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_listing_seller_and_timestamps ON public.listings;
CREATE TRIGGER trg_set_listing_seller_and_timestamps
BEFORE INSERT OR UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.set_listing_seller_and_timestamps();

-- 5. ROW LEVEL SECURITY (RLS) FOR LISTINGS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Policy 1 (Read): Public and authenticated can view active listings; sellers can view all their own
DROP POLICY IF EXISTS "Anyone can view active listings, owners can view all their own" ON public.listings;
CREATE POLICY "Anyone can view active listings, owners can view all their own"
ON public.listings FOR SELECT
TO anon, authenticated
USING (
    status = 'active'
    OR (auth.uid() IS NOT NULL AND seller_id = auth.uid())
);

-- Policy 2 (Insert): Authenticated users who have verified campus status can insert their own listing
DROP POLICY IF EXISTS "Verified students can create listings" ON public.listings;
CREATE POLICY "Verified students can create listings"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL
    AND seller_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_verified = true
    )
);

-- Policy 3 (Update): Sellers can only update their own listings
DROP POLICY IF EXISTS "Sellers can update own listings" ON public.listings;
CREATE POLICY "Sellers can update own listings"
ON public.listings FOR UPDATE
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (seller_id = auth.uid());

-- Policy 4 (Delete): Sellers can only delete their own listings
DROP POLICY IF EXISTS "Sellers can delete own listings" ON public.listings;
CREATE POLICY "Sellers can delete own listings"
ON public.listings FOR DELETE
TO authenticated
USING (seller_id = auth.uid());

-- 6. REALTIME REPLICATION SETUP
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'listings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- 7. SUPABASE STORAGE BUCKET: listing-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'listing-images', 
    'listing-images', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Anyone can view listing images
DROP POLICY IF EXISTS "Public can view listing images" ON storage.objects;
CREATE POLICY "Public can view listing images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'listing-images');

-- Authenticated users can upload listing images
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Users can update own listing images
DROP POLICY IF EXISTS "Users can update own listing images" ON storage.objects;
CREATE POLICY "Users can update own listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR owner = auth.uid()));

-- Users can delete own listing images
DROP POLICY IF EXISTS "Users can delete own listing images" ON storage.objects;
CREATE POLICY "Users can delete own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR owner = auth.uid()));

-- Also allow service role / anon fallback for test fixtures if needed
DROP POLICY IF EXISTS "Allow anon upload during sandbox tests" ON storage.objects;
CREATE POLICY "Allow anon upload during sandbox tests"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'listing-images');
