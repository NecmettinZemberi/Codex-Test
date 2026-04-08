'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type NoticeKind = 'added' | 'duplicate';

function getNoticeCopy(kind: NoticeKind) {
  if (kind === 'duplicate') {
    return {
      title: 'Parça zaten listede',
      message: 'Bu parça zaten çalışma listende yer alıyor.',
      tone: 'border-amber-700/70 bg-[linear-gradient(180deg,rgba(180,83,9,0.18),rgba(24,24,24,0.98))] text-stone-50',
      dot: 'bg-amber-300',
    };
  }

  return {
    title: 'Parça listeye eklendi',
    message: 'Parça çalışma listene eklendi.',
    tone: 'border-emerald-700/80 bg-[linear-gradient(180deg,rgba(5,150,105,0.18),rgba(18,18,18,0.98))] text-stone-50',
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
    if (notice !== 'added' && notice !== 'duplicate') {
      return null;
    }

    return getNoticeCopy(notice);
  }, [notice]);

  const clearNotice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('notice');
    params.delete('notice_target');
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

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
  }, [copy]);

  if (!copy) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex justify-end sm:inset-x-6 sm:bottom-6">
      <div
        className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/8 transition duration-200 sm:max-w-md ${
          copy.tone
        } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className={`mt-1 h-2.5 w-2.5 rounded-full ${copy.dot}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-[0.01em]">{copy.title}</p>
            <p className="mt-1 text-sm leading-6 text-stone-200">{copy.message}</p>
            {notice === 'added' && noticeTarget ? (
              <div className="mt-3 text-sm text-stone-100">
                <Link
                  href={noticeTarget}
                  className="font-bold tracking-[0.01em] text-stone-50 transition hover:text-white"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/10 text-lg text-stone-200 transition hover:bg-white/8 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
