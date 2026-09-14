-- ==============================================================================
-- 0001_initial_schema.sql
-- Mụta Pioneer Platform Complete Database Schema
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create public.pioneers table
CREATE TABLE IF NOT EXISTS public.pioneers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  pioneer_number integer UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  university text NOT NULL DEFAULT 'Rivers State University',
  department text NOT NULL,
  level text NOT NULL,
  referral_code text NOT NULL UNIQUE,
  referred_by uuid,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'active', 'inactive')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pioneers_pkey PRIMARY KEY (id),
  CONSTRAINT pioneers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT pioneers_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.pioneers(id) ON DELETE SET NULL
);

-- Sequence for pioneer numbers
CREATE SEQUENCE IF NOT EXISTS pioneer_number_seq START 1;

-- 3. Create public.contributions table
CREATE TABLE IF NOT EXISTS public.contributions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pioneer_id uuid NOT NULL,
  amount integer NOT NULL CHECK (amount >= 2000),
  paystack_ref text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contributions_pkey PRIMARY KEY (id),
  CONSTRAINT contributions_pioneer_id_fkey FOREIGN KEY (pioneer_id) REFERENCES public.pioneers(id) ON DELETE CASCADE
);

-- 4. Create public.feature_ideas table
CREATE TABLE IF NOT EXISTS public.feature_ideas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pioneer_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  importance text NOT NULL DEFAULT 'important' CHECK (importance IN ('nice_to_have', 'important', 'really_need')),
  status text NOT NULL DEFAULT 'under_review' CHECK (status IN ('under_review', 'planned', 'shipped', 'declined')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feature_ideas_pkey PRIMARY KEY (id),
  CONSTRAINT feature_ideas_pioneer_id_fkey FOREIGN KEY (pioneer_id) REFERENCES public.pioneers(id) ON DELETE CASCADE
);

-- 5. Create public.feature_votes table
CREATE TABLE IF NOT EXISTS public.feature_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL,
  pioneer_id uuid NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feature_votes_pkey PRIMARY KEY (id),
  CONSTRAINT feature_votes_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.feature_ideas(id) ON DELETE CASCADE,
  CONSTRAINT feature_votes_pioneer_id_fkey FOREIGN KEY (pioneer_id) REFERENCES public.pioneers(id) ON DELETE CASCADE,
  CONSTRAINT feature_votes_unique UNIQUE (feature_id, pioneer_id)
);

-- 6. Create public.updates table
CREATE TABLE IF NOT EXISTS public.updates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  image_url text,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT updates_pkey PRIMARY KEY (id)
);

-- 7. Create public.admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'ops' CHECK (role IN ('super_admin', 'ops', 'moderator')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 8. Create public.admin_actions table
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_actions_pkey PRIMARY KEY (id),
  CONSTRAINT admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON DELETE CASCADE
);

-- 9. Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_pioneers_user_id ON public.pioneers(user_id);
CREATE INDEX IF NOT EXISTS idx_pioneers_email ON public.pioneers(email);
CREATE INDEX IF NOT EXISTS idx_pioneers_referral_code ON public.pioneers(referral_code);
CREATE INDEX IF NOT EXISTS idx_pioneers_status ON public.pioneers(status);
CREATE INDEX IF NOT EXISTS idx_contributions_pioneer_id ON public.contributions(pioneer_id);
CREATE INDEX IF NOT EXISTS idx_contributions_paystack_ref ON public.contributions(paystack_ref);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature_id ON public.feature_votes(feature_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.pioneers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- 11. Policies
-- Pioneers can read their own profile
CREATE POLICY "Pioneers can read own profile" ON public.pioneers
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone authenticated can view public pioneer leaderboard/number
CREATE POLICY "Authenticated users can read basic pioneer list" ON public.pioneers
  FOR SELECT TO authenticated USING (true);

-- Contributions policies
CREATE POLICY "Pioneers can view own contributions" ON public.contributions
  FOR SELECT USING (
    pioneer_id IN (SELECT id FROM public.pioneers WHERE user_id = auth.uid())
  );

-- Feature ideas policies
CREATE POLICY "Anyone can view feature ideas" ON public.feature_ideas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Pioneers can create feature ideas" ON public.feature_ideas
  FOR INSERT TO authenticated WITH CHECK (
    pioneer_id IN (SELECT id FROM public.pioneers WHERE user_id = auth.uid() AND status = 'active')
  );

-- Feature votes policies
CREATE POLICY "Anyone can view feature votes" ON public.feature_votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Active pioneers can vote" ON public.feature_votes
  FOR ALL TO authenticated USING (
    pioneer_id IN (SELECT id FROM public.pioneers WHERE user_id = auth.uid() AND status = 'active')
  );

-- Updates policies
CREATE POLICY "Anyone can view platform updates" ON public.updates
  FOR SELECT TO authenticated USING (true);

-- Admins full access policy (bypassed by service role, checked by user_id)
CREATE POLICY "Admins have full access" ON public.admins
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 12. Helper RPC for Checkout: create_pending_contribution
CREATE OR REPLACE FUNCTION public.create_pending_contribution(
  p_amount integer,
  p_reference text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pioneer_id uuid;
  v_contribution_id uuid;
BEGIN
  -- Look up pioneer profile for current authenticated user
  SELECT id INTO v_pioneer_id
  FROM public.pioneers
  WHERE user_id = auth.uid();

  IF v_pioneer_id IS NULL THEN
    RAISE EXCEPTION 'Pioneer profile not found for the authenticated user.';
  END IF;

  IF p_amount < 2000 THEN
    RAISE EXCEPTION 'Minimum contribution is ₦2,000.';
  END IF;

  INSERT INTO public.contributions (
    pioneer_id,
    amount,
    paystack_ref,
    status
  ) VALUES (
    v_pioneer_id,
    p_amount,
    p_reference,
    'pending'
  )
  RETURNING id INTO v_contribution_id;

  RETURN jsonb_build_object(
    'success', true,
    'contribution_id', v_contribution_id,
    'reference', p_reference
  );
END;
$$;

-- 13. Trigger function to create public.pioneers row upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_pioneer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code text;
  v_referred_by_id uuid;
  v_pioneer_num integer;
BEGIN
  -- Generate unique referral code (e.g. 6 uppercase chars)
  v_referral_code := upper(substring(md5(random()::text) from 1 for 6));
  
  -- Get next pioneer number
  v_pioneer_num := nextval('pioneer_number_seq');

  -- Check if referred by another code
  IF (NEW.raw_user_meta_data->>'referred_by_code') IS NOT NULL AND (NEW.raw_user_meta_data->>'referred_by_code') <> '' THEN
    SELECT id INTO v_referred_by_id
    FROM public.pioneers
    WHERE referral_code = upper(NEW.raw_user_meta_data->>'referred_by_code');
  END IF;

  INSERT INTO public.pioneers (
    user_id,
    pioneer_number,
    full_name,
    email,
    phone,
    university,
    department,
    level,
    referral_code,
    referred_by,
    status
  ) VALUES (
    NEW.id,
    v_pioneer_num,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', 'Rivers State University'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    COALESCE(NEW.raw_user_meta_data->>'level', '100L'),
    v_referral_code,
    v_referred_by_id,
    'pending_payment'
  );

  RETURN NEW;
END;
$$;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_pioneer();

