begin;

alter table public.daily_psalms enable row level security;
alter table public.weekly_psalm_journey enable row level security;
alter table public.announcements enable row level security;
alter table public.prayer_requests enable row level security;

drop policy if exists "Anyone can delete daily psalms" on public.daily_psalms;
drop policy if exists "Anyone can insert daily psalms" on public.daily_psalms;
drop policy if exists "Anyone can read published daily psalms" on public.daily_psalms;
drop policy if exists "Anyone can update daily psalms" on public.daily_psalms;
drop policy if exists "Anyone can upsert daily psalms" on public.daily_psalms;

create policy "Published daily psalms are readable"
on public.daily_psalms
for select
to anon, authenticated
using (is_published = true);

create policy "Administrator manages daily psalms"
on public.daily_psalms
for all
to authenticated
using ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com');

drop policy if exists "Anyone can delete weekly journey" on public.weekly_psalm_journey;
drop policy if exists "Anyone can insert weekly journey" on public.weekly_psalm_journey;
drop policy if exists "Anyone can read published weekly journey" on public.weekly_psalm_journey;

create policy "Published weekly journey is readable"
on public.weekly_psalm_journey
for select
to anon, authenticated
using (is_published = true);

create policy "Administrator manages weekly journey"
on public.weekly_psalm_journey
for all
to authenticated
using ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com');

drop policy if exists "Anyone can insert announcements" on public.announcements;
drop policy if exists "Anyone can read published announcements" on public.announcements;

create policy "Published announcements are readable"
on public.announcements
for select
to anon, authenticated
using (is_published = true);

create policy "Administrator manages announcements"
on public.announcements
for all
to authenticated
using ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com');

drop policy if exists "Anyone can delete prayer requests" on public.prayer_requests;
drop policy if exists "Anyone can insert prayer requests" on public.prayer_requests;
drop policy if exists "Anyone can read prayer requests" on public.prayer_requests;
drop policy if exists "Anyone can update prayer requests" on public.prayer_requests;

create policy "Visitors can submit prayer requests"
on public.prayer_requests
for insert
to anon
with check (
  char_length(trim(request_text)) between 1 and 2000
  and tracking_code ~ '^PM-[A-Z0-9]{6,32}$'
  and coalesce(is_prayed, false) = false
  and admin_response is null
  and coalesce(is_response_read, false) = false
);

create policy "Administrator manages prayer requests"
on public.prayer_requests
for all
to authenticated
using ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'prnate7936@gmail.com');

create unique index if not exists prayer_requests_tracking_code_key
on public.prayer_requests (tracking_code);

create or replace function public.lookup_prayer_request(p_tracking_code text)
returns table (
  id uuid,
  request_text text,
  tracking_code text,
  created_at timestamptz,
  is_prayed boolean,
  admin_response text,
  is_response_read boolean
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.prayer_requests
  set is_response_read = true
  where prayer_requests.tracking_code = upper(trim(p_tracking_code))
    and prayer_requests.admin_response is not null
    and coalesce(prayer_requests.is_response_read, false) = false;

  return query
  select
    prayer_requests.id,
    prayer_requests.request_text,
    prayer_requests.tracking_code,
    prayer_requests.created_at,
    coalesce(prayer_requests.is_prayed, false),
    prayer_requests.admin_response,
    coalesce(prayer_requests.is_response_read, false)
  from public.prayer_requests
  where prayer_requests.tracking_code = upper(trim(p_tracking_code))
  limit 1;
end;
$$;

revoke all on function public.lookup_prayer_request(text) from public;
grant execute on function public.lookup_prayer_request(text) to anon, authenticated;

drop policy if exists "Anyone can read psalm images" on storage.objects;
drop policy if exists "Anyone can upload psalm images" on storage.objects;

create policy "Psalm images are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'psalm-images');

create policy "Administrator uploads psalm images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'psalm-images'
  and (select auth.jwt() ->> 'email') = 'prnate7936@gmail.com'
);

create policy "Administrator updates psalm images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'psalm-images'
  and (select auth.jwt() ->> 'email') = 'prnate7936@gmail.com'
)
with check (
  bucket_id = 'psalm-images'
  and (select auth.jwt() ->> 'email') = 'prnate7936@gmail.com'
);

create policy "Administrator deletes psalm images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'psalm-images'
  and (select auth.jwt() ->> 'email') = 'prnate7936@gmail.com'
);

commit;

