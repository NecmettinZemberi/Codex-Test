import { songs } from '@/data/mockData';
import { PracticeStatus } from '@/types/domain';

export const statusLabels: Record<PracticeStatus, string> = {
  planlandi: 'Planlandı',
  siraya_alindi: 'Sıraya Alındı',
  calisiliyor: 'Çalışılıyor',
  tamamlandi: 'Tamamlandı',
};

export function getSongById(songId: string) {
  return songs.find((song) => song.id === songId);
}
