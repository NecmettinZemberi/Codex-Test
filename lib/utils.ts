import { songs } from '@/data/mockData';
import { PracticeStatus, SongType } from '@/types/domain';

export const statusLabels: Record<PracticeStatus, string> = {
  planlandi: 'Planlandı',
  siraya_alindi: 'Sıraya Alındı',
  calisiliyor: 'Çalışılıyor',
  tamamlandi: 'Tamamlandı',
};

export const songTypeLabels: Record<SongType, string> = {
  bozlak: 'Bozlak',
  turku: 'Türkü',
  'uzun hava': 'Uzun Hava',
};

export function getSongById(songId: string) {
  return songs.find((song) => song.id === songId);
}
