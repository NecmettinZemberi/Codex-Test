import { Artist, Song, UserPracticeItem } from '@/types/domain';

export const artists: Artist[] = [
  {
    id: 'a1',
    name: 'Neşet Ertaş',
    slug: 'neset-ertas',
    short_bio:
      'Anadolu abdallık geleneğinin en güçlü temsilcilerinden biri. Bozlak tavrını geniş kitlelere taşıdı.',
    image_url:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a2',
    name: 'Çekiç Ali',
    slug: 'cekic-ali',
    short_bio:
      'Kırşehir yöresinin güçlü saz ustalarından. Geleneksel tavrı disiplinli icrayla birleştirdi.',
    image_url:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a3',
    name: 'Hacı Taşan',
    slug: 'haci-tasan',
    short_bio:
      'Abdal geleneğinin önemli isimlerinden. Duygulu yorumları ve güçlü repertuvarıyla tanınır.',
    image_url:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a4',
    name: 'Muharrem Ertaş',
    slug: 'muharrem-ertas',
    short_bio:
      'Neşet Ertaş’ın babası, bozlak tavrının kök seslerinden biri. Yöresel üslubun taşıyıcı ismidir.',
    image_url:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a5',
    name: 'Ekrem Çelebi',
    slug: 'ekrem-celebi',
    short_bio:
      'Halk müziği repertuvarında yer alan eserleriyle bilinen, tavır odaklı icraya önem veren sanatçı.',
    image_url:
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
  },
];

export const songs: Song[] = [
  {
    id: 's1',
    title: 'Neredesin Sen',
    artist: 'Neşet Ertaş',
    type: 'bozlak',
    youtube_url: 'https://www.youtube.com/watch?v=example1',
    lyrics_or_notes: 'Sözler / Notlar: Aksak ritimde giriş cümlesini temiz çalış.',
    difficulty: 'orta',
    created_at: '2026-04-07T00:00:00Z',
  },
  {
    id: 's2',
    title: 'Yalan Dünya',
    artist: 'Neşet Ertaş',
    type: 'turku',
    youtube_url: 'https://www.youtube.com/watch?v=example2',
    lyrics_or_notes: 'Sözler / Notlar: Kıta sonlarında vibrato dozunu azalt.',
    difficulty: 'kolay',
    created_at: '2026-04-07T00:00:00Z',
  },
  {
    id: 's3',
    title: 'Kırşehir Bozlağı',
    artist: 'Çekiç Ali',
    type: 'bozlak',
    youtube_url: 'https://www.youtube.com/watch?v=example3',
    lyrics_or_notes: 'Sözler / Notlar: Uzun çekişlerde sağ el kontrolünü sabit tut.',
    difficulty: 'zor',
    created_at: '2026-04-07T00:00:00Z',
  },
  {
    id: 's4',
    title: 'Gönül Dağı',
    artist: 'Hacı Taşan',
    type: 'turku',
    youtube_url: 'https://www.youtube.com/watch?v=example4',
    lyrics_or_notes: 'Sözler / Notlar: Dönüş cümlelerinde tempo kaybını engelle.',
    difficulty: 'orta',
    created_at: '2026-04-07T00:00:00Z',
  },
  {
    id: 's5',
    title: 'Abdalın Feryadı',
    artist: 'Muharrem Ertaş',
    type: 'uzun hava',
    youtube_url: 'https://www.youtube.com/watch?v=example5',
    lyrics_or_notes: 'Sözler / Notlar: Serbest bölümde nefes yerlerini önceden planla.',
    created_at: '2026-04-07T00:00:00Z',
  },
  {
    id: 's6',
    title: 'Yarim Senden Ayrılalı',
    artist: 'Ekrem Çelebi',
    type: 'turku',
    youtube_url: 'https://www.youtube.com/watch?v=example6',
    lyrics_or_notes: 'Sözler / Notlar: Es cümlelerinde mızrap yönlerini not al.',
    difficulty: 'kolay',
    created_at: '2026-04-07T00:00:00Z',
  },
];

export const mockPracticeList: UserPracticeItem[] = [
  {
    id: 'p1',
    user_id: 'demo-user',
    song_id: 's1',
    status: 'planlandi',
    sort_order: 1,
    personal_note: 'Günlük 20 dk giriş bölümüne odaklan.',
    created_at: '2026-04-07T00:00:00Z',
    updated_at: '2026-04-07T00:00:00Z',
  },
  {
    id: 'p2',
    user_id: 'demo-user',
    song_id: 's3',
    status: 'calisiliyor',
    sort_order: 2,
    personal_note: 'Uzun hava geçişlerini metronomsuz tekrar et.',
    created_at: '2026-04-07T00:00:00Z',
    updated_at: '2026-04-07T00:00:00Z',
  },
];
