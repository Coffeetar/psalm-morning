export type DailyPsalm = {
  id: string;
  devotional_date: string;
  psalm_reference: string;
  psalm_text: string;
  reflection: string | null;
  prayer: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at?: string;
};

export type PrayerRequest = {
  id: string;
  request_text: string;
  tracking_code: string;
  created_at: string;
  is_prayed: boolean;
  admin_response: string | null;
  is_response_read: boolean;
};

export type WeeklyJourney = {
  id: string;
  weekday: string;
  psalm_reference: string;
  theme: string | null;
  theme_image_url: string | null;
  introduction: string | null;
  is_published: boolean;
  created_at?: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  link_url: string | null;
  created_at: string;
  is_published: boolean;
};

