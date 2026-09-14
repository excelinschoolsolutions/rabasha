-- ==============================================================================
-- 0002_seed_admin.sql
-- Seed script for Admin User (yam@gmail.com / password123)
-- Run this in your Supabase SQL Editor to create or link the initial super_admin.
-- ==============================================================================

DO $$
DECLARE
  v_admin_email text := 'yam@gmail.com';
  v_admin_password text := 'password123';
  v_user_id uuid;
BEGIN
  -- 1. Check if user already exists in auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_admin_email;

  -- 2. If user does not exist in auth.users, create the user
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_admin_email,
      crypt(v_admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Super Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- Insert into auth.identities with provider_id explicitly set
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_admin_email),
      'email',
      v_admin_email,
      now(),
      now(),
      now()
    );
  END IF;

  -- 3. Ensure the record exists in public.admins with super_admin role
  INSERT INTO public.admins (
    user_id,
    role
  ) VALUES (
    v_user_id,
    'super_admin'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET role = 'super_admin';

  RAISE NOTICE 'Admin % successfully created and assigned super_admin role with user_id %', v_admin_email, v_user_id;
END;
$$;
