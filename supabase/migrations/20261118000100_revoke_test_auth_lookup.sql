-- Debug helper leaked account existence/role by email; keep it service-role only.
revoke execute on function public.test_auth_lookup(text) from public, anon, authenticated;
