'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { songs as catalogSongs } from '@/data/mockData';
import { getCurrentUserContext } from '@/utils/auth/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const PRACTICE_LIST_HREF = '/dashboard?tab=practice';

function isTargetDateSchemaCacheError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return (
    error.code === 'PGRST204' &&
    (error.message ?? '').toLowerCase().includes('target_date')
  );
}

function isSongLearningSchemaCacheError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  const message = (error.message ?? '').toLowerCase();

  return (
    error.code === 'PGRST204' &&
    (message.includes('slow_play_youtube_url') || message.includes('beginner_order'))
  );
}

async function getSupabaseUser() {
  const auth = await getCurrentUserContext();

  if (auth.mode === 'demo') {
    return { mode: 'demo' as const };
  }

  if (!auth.isAuthenticated || !auth.user) {
    redirect('/login?next=/dashboard');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/dashboard');
  }

  return { mode: 'supabase' as const, supabase, user };
}

async function ensureDatabaseSong(catalogSongId: string) {
  const catalogSong = catalogSongs.find((song) => song.id === catalogSongId);

  if (!catalogSong) {
    return { error: 'song_not_found' as const };
  }

  const authUser = await getSupabaseUser();
  if (authUser.mode === 'demo') {
    return { error: 'demo_add_redirect' as const };
  }

  const { supabase } = authUser;
  const admin = createAdminClient();
  const lookupClient = admin ?? supabase;

  const { data: existingSongs, error: existingSongError } = await lookupClient
    .from('songs')
    .select('id')
    .eq('title', catalogSong.title)
    .eq('artist', catalogSong.artist)
    .eq('type', catalogSong.type)
    .limit(1);

  if (existingSongError) {
    console.error('catalog lookup failed', existingSongError);
    const message = existingSongError.message.toLowerCase();

    if (message.includes('relation') || message.includes('does not exist')) {
      return { error: 'catalog_schema_required' as const };
    }

    return { error: 'catalog_lookup_failed' as const };
  }

  const existingSongId = existingSongs?.[0]?.id;
  if (existingSongId) {
    return { songId: existingSongId };
  }

  if (!admin) {
    return { error: 'catalog_sync_required' as const };
  }

  let { data: insertedSong, error: insertSongError } = await admin
    .from('songs')
    .insert({
      title: catalogSong.title,
      artist: catalogSong.artist,
      type: catalogSong.type,
      youtube_url: catalogSong.youtube_url,
      slow_play_youtube_url: catalogSong.slow_play_youtube_url ?? null,
      lyrics_or_notes: catalogSong.lyrics_or_notes,
      difficulty: catalogSong.difficulty ?? null,
      beginner_order: catalogSong.beginner_order ?? null,
      created_at: catalogSong.created_at,
    })
    .select('id')
    .single();

  if (isSongLearningSchemaCacheError(insertSongError)) {
    const retry = await admin
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

    insertedSong = retry.data;
    insertSongError = retry.error;
  }

  if (insertSongError || !insertedSong) {
    console.error('catalog sync failed', insertSongError);
    return { error: 'catalog_sync_failed' as const };
  }

  return { songId: insertedSong.id };
}

function withNotice(
  redirectTo: string,
  notice: 'added' | 'duplicate' | 'saved',
  options?: {
    savedItemId?: string;
  },
) {
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/dashboard';
  const url = new URL(safeRedirect, 'http://localhost');
  url.searchParams.set('notice', notice);

  if (notice === 'added') {
    url.searchParams.set('notice_target', PRACTICE_LIST_HREF);
  }

  if (notice === 'saved' && options?.savedItemId) {
    url.searchParams.set('saved_item', options.savedItemId);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export async function addPracticeItem(formData: FormData) {
  const catalogSongId = String(formData.get('song_id') ?? '');
  const redirectTo = String(formData.get('redirect_to') ?? '/dashboard');
  const feedbackMode = String(formData.get('feedback_mode') ?? 'toast');
  if (!catalogSongId) return;

  const authUser = await getSupabaseUser();

  if (authUser.mode === 'demo') {
    redirect(`/dashboard?tab=practice&demo_add=${encodeURIComponent(catalogSongId)}`);
  }

  const { supabase, user } = authUser;
  const writeClient = createAdminClient() ?? supabase;
  const resolvedSong = await ensureDatabaseSong(catalogSongId);
  if ('error' in resolvedSong) {
    if (resolvedSong.error === 'demo_add_redirect') {
      redirect(`/dashboard?tab=practice&demo_add=${encodeURIComponent(catalogSongId)}`);
    }

    redirect(`/dashboard?error=${resolvedSong.error}`);
  }

  const { data: existingItem } = await writeClient
    .from('user_practice_list')
    .select('id')
    .eq('user_id', user.id)
    .eq('song_id', resolvedSong.songId)
    .limit(1);

  if ((existingItem?.length ?? 0) > 0) {
    if (feedbackMode === 'inline' && redirectTo.startsWith('/')) {
      redirect(redirectTo);
    }

    redirect(withNotice(redirectTo, 'duplicate'));
  }

  const { data: maxOrderData } = await writeClient
    .from('user_practice_list')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  let { error: insertError } = await writeClient.from('user_practice_list').insert({
    user_id: user.id,
    song_id: resolvedSong.songId,
    status: 'planlandi',
    sort_order: (maxOrderData?.sort_order ?? 0) + 1,
    personal_note: '',
    target_date: null,
  });

  if (isTargetDateSchemaCacheError(insertError)) {
    const retry = await writeClient.from('user_practice_list').insert({
      user_id: user.id,
      song_id: resolvedSong.songId,
      status: 'planlandi',
      sort_order: (maxOrderData?.sort_order ?? 0) + 1,
      personal_note: '',
    });

    insertError = retry.error;
  }

  if (insertError) {
    console.error('practice insert failed', insertError);
    redirect('/dashboard?error=practice_insert_failed');
  }

  revalidatePath('/dashboard');
  revalidatePath('/turkuler');
  if (redirectTo.startsWith('/')) {
    if (feedbackMode === 'inline') {
      redirect(redirectTo);
    }

    redirect(withNotice(redirectTo, 'added'));
  }
}

export async function savePracticeItem(formData: FormData) {
  const itemId = String(formData.get('item_id') ?? '');
  const status = String(formData.get('status') ?? 'planlandi');
  const personalNote = String(formData.get('personal_note') ?? '').trim();
  const targetDateValue = String(formData.get('target_date') ?? '').trim();
  const redirectTo = String(formData.get('redirect_to') ?? PRACTICE_LIST_HREF);

  const allowed = ['planlandi', 'siraya_alindi', 'calisiliyor', 'tamamlandi'];
  if (!itemId || !allowed.includes(status)) return;

  const authUser = await getSupabaseUser();
  if (authUser.mode === 'demo') {
    redirect(redirectTo);
  }

  const { supabase, user } = authUser;
  const writeClient = createAdminClient() ?? supabase;
  let { error } = await writeClient
    .from('user_practice_list')
    .update({
      status,
      personal_note: personalNote,
      target_date: targetDateValue || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (isTargetDateSchemaCacheError(error)) {
    const retry = await writeClient
      .from('user_practice_list')
      .update({
        status,
        personal_note: personalNote,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('user_id', user.id);

    error = retry.error;
  }

  if (error) {
    console.error('practice update failed', error);
    redirect('/dashboard?error=practice_update_failed');
  }

  revalidatePath('/dashboard');
  redirect(redirectTo.startsWith('/') ? redirectTo : PRACTICE_LIST_HREF);
}

export async function deletePracticeItem(formData: FormData) {
  const itemId = String(formData.get('item_id') ?? '');
  if (!itemId) return;

  const authUser = await getSupabaseUser();
  if (authUser.mode === 'demo') {
    redirect('/dashboard?tab=practice');
  }

  const { supabase, user } = authUser;
  const writeClient = createAdminClient() ?? supabase;
  const { error } = await writeClient
    .from('user_practice_list')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    console.error('practice delete failed', error);
    redirect('/dashboard?error=practice_delete_failed');
  }

  revalidatePath('/dashboard');
}
