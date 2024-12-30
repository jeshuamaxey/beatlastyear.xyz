DO $$ 
  DECLARE admin_user_email CONSTANT text DEFAULT 'admin@test.com';
  DECLARE test_user_email CONSTANT text DEFAULT 'user@test.com';

BEGIN

-- USERS
-- create test users
INSERT INTO
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '91ba106d-9cde-42ea-91f2-86105c53dff8',
    'authenticated',
    'authenticated',
    'james@example.com',
    crypt ('password123', gen_salt ('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}'::jsonb,
    ('{
      "slug": "james"
    }')::jsonb,
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
  );

INSERT INTO
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) (
    select
      '00000000-0000-0000-0000-000000000000',
      CAST('00000000-0000-0000-0000-000000' || LPAD((ROW_NUMBER() OVER ()::text), 6, '0') AS UUID),
      'authenticated',
      'authenticated',
      'user' || (ROW_NUMBER() OVER ()) || '@example.com',
      crypt ('password123', gen_salt ('bf')),
      current_timestamp,
      current_timestamp,
      current_timestamp,
      '{"provider":"email","providers":["email"]}'::jsonb,
      ('{
        "slug": "slug_' || (ROW_NUMBER() OVER ()) || '"
      }')::jsonb,
      current_timestamp,
      current_timestamp,
      '',
      '',
      '',
      ''
    FROM
      generate_series(1, 10)
  );

-- test user email identities
INSERT INTO
  auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) (
    select
      uuid_generate_v4 (),
      id,
      id,
      format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    from
      auth.users
  );

-- give user1 admin rights
PERFORM set_claim('00000000-0000-0000-0000-000000000001', 'claims_admin', 'true');

-- MUST BE LAST
END $$;