-- Update partners table with detailed fields
alter table public.partners
add column if not exists full_name text,
add column if not exists phone text,
add column if not exists country text,
add column if not exists promotion_platform text,
add column if not exists platform_url text,
add column if not exists audience_size text,
add column if not exists niche text,
add column if not exists payment_method text,
add column if not exists payment_details text,
add column if not exists tax_info text,
add column if not exists preferred_currency text,
add column if not exists onboarding_completed boolean default false;

-- Update saas_companies table with detailed fields
alter table public.saas_companies
add column if not exists short_description text,
add column if not exists long_description text,
add column if not exists category text,
add column if not exists year_founded integer,
add column if not exists commission_model text,
add column if not exists cookie_duration integer,
add column if not exists landing_page_url text,
add column if not exists tracking_method text,
add column if not exists partner_program_url text,
add column if not exists exclusive_deal text,
add column if not exists technical_contact text,
add column if not exists geo_restrictions text,
add column if not exists supported_languages text[],
add column if not exists onboarding_completed boolean default false;
