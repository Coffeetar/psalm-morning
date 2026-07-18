# Psalm Morning v1.0 security review

## Status

- The browser uses a Supabase public/anonymous key. This is expected, but every exposed table must have RLS enabled and least-privilege policies.
- The devotional-generation API now verifies the caller's Supabase access token and administrator email before making an OpenAI request.
- The OpenAI API key remains server-only.
- Prayer requests still need a database-policy review before production release.

## Required access matrix

| Resource | Public visitor | Signed-in administrator |
| --- | --- | --- |
| `daily_psalms` | Select published rows only | Select, insert, update, delete |
| `weekly_psalm_journey` | Select published rows only | Select, insert, update, delete |
| `announcements` | Select published rows only | Select, insert, update, delete |
| `prayer_requests` | Submit a request; retrieve one request only through a protected lookup | Select, update, delete |
| `psalm-images` storage | Read public images | Upload and delete |

## Blocking prayer-request issue

A normal RLS `SELECT` policy cannot make a row safe merely because the browser adds
`.eq("tracking_code", code)` to its query. If `anon` can select prayer-request rows,
an attacker can call the Data API without that filter and enumerate all allowed rows.

Before production, choose one of these designs:

1. Recommended for v1.0: revoke direct anonymous `SELECT` and `UPDATE` access to
   `prayer_requests`, then expose narrowly scoped database functions for lookup and
   response-read acknowledgement. The lookup function accepts the high-entropy tracking
   secret and returns only the matching safe columns.
2. Alternative: create an anonymous Supabase Auth user for each device, store its
   `auth.uid()` on the request, and restrict rows by owner. This is stronger for normal
   use but does not preserve cross-device lookup using only a tracking code.

The current six-character base-36 tracking suffix should also be lengthened before
production if it remains the sole lookup secret.

## Dashboard checks

Run these checks in the Supabase Dashboard before applying any policy changes:

1. Database → Policies: confirm RLS is enabled on all four public tables.
2. Review every policy for both `anon` and `authenticated`.
3. Check for broad policies such as `using (true)` or `with check (true)`.
4. Remember that permissive policies are combined with `OR`; one broad policy can
   override a narrower policy.
5. Storage → Policies: verify that only the administrator can upload or delete from
   `psalm-images`.
6. Security Advisor: review unresolved findings.

## Configuration

Add `ADMIN_EMAIL` as a server-side deployment environment variable. Until it is set,
the app keeps the current administrator email as a compatibility fallback.

When convenient, migrate the legacy public `anon` key to a Supabase publishable key.
Do not place a secret or service-role key in a `NEXT_PUBLIC_` variable or browser code.

