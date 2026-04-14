'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type NoticeKind = 'added' | 'duplicate' | 'saved';

function getNoticeCopy(kind: NoticeKind) {
  if (kind === 'duplicate') {
    return {
      label: 'Arşiv uyarısı',
      title: 'Parça zaten listede',
      message: 'Bu parça zaten çalışma listende yer alıyor.',
      tone:
        'border-amber-700/60 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.16),transparent_40%),linear-gradient(180deg,rgba(24,24,24,0.98),rgba(10,10,10,0.98))] text-stone-50',
      dot: 'bg-amber-300',
    };
  }

  if (kind === 'saved') {
    return {
      label: 'Çalışma listesi',
      title: 'Parça güncellendi',
      message: 'Durum, tarih ve not değişikliklerin başarıyla kaydedildi.',
      tone:
        'border-emerald-700/65 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_40%),linear-gradient(180deg,rgba(22,22,22,0.98),rgba(8,8,8,0.98))] text-stone-50',
      dot: 'bg-emerald-300',
    };
  }

  return {
    label: 'Arşiv bildirimi',
    title: 'Parça listeye eklendi',
    message: 'Parça çalışma listene eklendi.',
    tone:
      'border-emerald-700/65 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_40%),linear-gradient(180deg,rgba(22,22,22,0.98),rgba(8,8,8,0.98))] text-stone-50',
    dot: 'bg-emerald-300',
  };
}

export function GlobalNoticeToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  const notice = searchParams.get('notice') as NoticeKind | null;
  const noticeTarget = searchParams.get('notice_target');

  const copy = useMemo(() => {
    if (notice !== 'added' && notice !== 'duplicate' && notice !== 'saved') {
      return null;
    }

    return getNoticeCopy(notice);
  }, [notice]);

  const clearNotice = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('notice');
    params.delete('notice_target');
    params.delete('saved_item');
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!copy) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeout = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(clearNotice, 180);
    }, 3800);

    return () => window.clearTimeout(timeout);
  }, [clearNotice, copy]);

  if (!copy) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex justify-end sm:inset-x-6 sm:bottom-6">
      <div
        className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-[22px] border px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.52)] ring-1 ring-white/10 backdrop-blur-sm transition duration-200 sm:max-w-md ${
          copy.tone
        } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="flex items-start gap-3">
          <div className={`mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor] ${copy.dot}`} />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-300/85">{copy.label}</p>
            <p className="mt-2 text-base font-semibold tracking-[0.01em] text-stone-50">{copy.title}</p>
            <p className="mt-1 text-sm leading-6 text-stone-200/95">{copy.message}</p>

            {notice === 'added' && noticeTarget ? (
              <div className="mt-4">
                <Link
                  href={noticeTarget}
                  className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-3 py-2 text-sm font-bold tracking-[0.01em] text-stone-50 transition hover:bg-white/16 hover:text-white"
                >
                  Listeye git
                </Link>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setVisible(false);
              window.setTimeout(clearNotice, 180);
            }}
            aria-label="Bildirimi kapat"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/18 text-lg text-stone-200 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
