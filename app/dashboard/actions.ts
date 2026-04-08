'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { songs as catalogSongs } from '@/data/mockData';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

async function ensureDatabaseSong(catalogSongId: string) {
  const catalogSong = catalogSongs.find((song) => song.id === catalogSongId);

  if (!catalogSong) {
    return { error: 'song_not_found' as const };
  }

  const supabase = await createClient();
  const { data: existingSongs, error: existingSongError } = await supabase
    .from('songs')
    .select('id')
    .eq('title', catalogSong.title)
    .eq('artist', catalogSong.artist)
    .eq('type', catalogSong.type)
    .limit(1);

  if (existingSongError) {
    return { error: 'catalog_lookup_failed' as const };
  }

  const existingSongId = existingSongs?.[0]?.id;
  if (existingSongId) {
    return { songId: existingSongId };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { error: 'catalog_sync_required' as const };
  }

  const { data: insertedSong, error: insertSongError } = await admin
    .from('songs')
    .insert({
      title: catalogSong.title,
      artist: catalogSong.artist,
      type: catalogSong.type,
      youtube_url: catalogSong.youtube_url,
      lyrics_or_notes: catalogSong.lyrics_or_notes,
      difficulty: catalogSong.difficulty ?? null,
      created_at: catalogSong.created_at,
    })
    .select('id')
    .single();

  if (insertSongError || !insertedSong) {
    return { error: 'catalog_sync_failed' as const };
  }

  return { songId: insertedSong.id };
}

export async function addPracticeItem(formData: FormData) {
  const catalogSongId = String(formData.get('song_id') ?? '');
  if (!catalogSongId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const resolvedSong = await ensureDatabaseSong(catalogSongId);
  if ('error' in resolvedSong) {
    redirect(`/dashboard?error=${resolvedSong.error}`);
  }

  const { data: existingItem } = await supabase
    .from('user_practice_list')
    .select('id')
    .eq('user_id', user.id)
    .eq('song_id', resolvedSong.songId)
    .limit(1);

  if ((existingItem?.length ?? 0) > 0) {
    redirect('/dashboard?error=duplicate_song');
  }

  const { data: maxOrderData } = await supabase
    .from('user_practice_list')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from('user_practice_list').insert({
    user_id: user.id,
    song_id: resolvedSong.songId,
    status: 'planlandi',
    sort_order: (maxOrderData?.sort_order ?? 0) + 1,
    personal_note: '',
  });

  if (insertError) {
    redirect('/dashboard?error=practice_insert_failed');
  }

  revalidatePath('/dashboard');
}

export async function updatePracticeStatus(formData: FormData) {
  const itemId = String(formData.get('item_id') ?? '');
  const status = String(formData.get('status') ?? 'planlandi');

  const allowed = ['planlandi', 'siraya_alindi', 'calisiliyor', 'tamamlandi'];
  if (!itemId || !allowed.includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from('user_practice_list')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  revalidatePath('/dashboard');
}
