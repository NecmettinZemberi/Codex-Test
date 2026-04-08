import { songs } from '@/data/mockData';
import { getCurrentUserContext } from '@/utils/auth/server';
import { createClient } from '@/utils/supabase/server';
import { SongType } from '@/types/domain';
import { TurkulerClientPage } from '@/components/songs/TurkulerClientPage';

type PracticeSongRow = {
  songs:
    | {
        title: string;
        artist: string;
        type: SongType;
      }
    | Array<{
        title: string;
        artist: string;
        type: SongType;
      }>
    | null;
};

export default async function TurkulerPage() {
  const auth = await getCurrentUserContext();
  let initialPracticeSongIds: string[] = [];

  if (auth.mode === 'supabase' && auth.user) {
    const supabase = await createClient();
    const { data: practiceItems } = await supabase
      .from('user_practice_list')
      .select(
        `
        songs (title, artist, type)
      `,
      )
      .eq('user_id', auth.user.id);

    initialPracticeSongIds = ((practiceItems ?? []) as PracticeSongRow[])
      .map((item) => (Array.isArray(item.songs) ? item.songs[0] : item.songs))
      .filter((song): song is { title: string; artist: string; type: SongType } => Boolean(song))
      .map((practiceSong) =>
        songs.find(
          (catalogSong) =>
            catalogSong.title === practiceSong.title &&
            catalogSong.artist === practiceSong.artist &&
            catalogSong.type === practiceSong.type,
        )?.id,
      )
      .filter((songId): songId is string => Boolean(songId));
  }

  return (
    <TurkulerClientPage
      authMode={auth.mode}
      initialPracticeSongIds={initialPracticeSongIds}
    />
  );
}
