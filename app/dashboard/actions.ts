'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function addPracticeItem(formData: FormData) {
  const songId = String(formData.get('song_id') ?? '');
  if (!songId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: maxOrderData } = await supabase
    .from('user_practice_list')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from('user_practice_list').insert({
    user_id: user.id,
    song_id: songId,
    status: 'planlandi',
    sort_order: (maxOrderData?.sort_order ?? 0) + 1,
    personal_note: '',
  });

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
