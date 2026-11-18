-- Read-only RLS/privilege audit. Run in the Supabase SQL editor of any project.

-- 1. Public tables without Row Level Security (must be empty).
select schemaname, tablename
from pg_tables
where schemaname = 'public' and not rowsecurity;

-- 2. RLS policies that grant access to everyone (review each one).
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and (qual is null or qual = 'true' or with_check = 'true');

-- 3. Table privileges granted to the anon / authenticated roles.
select table_name, grantee, string_agg(privilege_type, ', ') as privileges
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
group by table_name, grantee
order by table_name;

-- 4. SECURITY DEFINER functions callable via the API (should be few or none).
select n.nspname as schema, p.proname as function
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef;

-- 5. Auth users created recently (spot spam signups while open signup was enabled).
select count(*) filter (where created_at > now() - interval '30 days') as last_30_days,
       count(*) as total
from auth.users;
