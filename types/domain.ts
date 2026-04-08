export type SongType = 'bozlak' | 'turku' | 'uzun hava';

export type PracticeStatus =
  | 'planlandi'
  | 'siraya_alindi'
  | 'calisiliyor'
  | 'tamamlandi';

export type Artist = {
  id: string;
  name: string;
  slug: string;
  short_bio: string;
  image_url: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  type: SongType;
  youtube_url: string;
  lyrics_or_notes: string;
  difficulty?: 'kolay' | 'orta' | 'zor';
  created_at: string;
};

export type UserPracticeItem = {
  id: string;
  user_id: string;
  song_id: string;
  status: PracticeStatus;
  sort_order: number;
  personal_note: string;
  target_date: string | null;
  created_at: string;
  updated_at: string;
};
