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
      tone: 'border-amber-700/70 bg-amber-700/12 text-amber-100',
    };
  }

  return {
    title: 'Parça listeye eklendi',
    message: 'Parça çalışma listene eklendi.',
    tone: 'border-emerald-700/80 bg-emerald-700/14 text-stone-100',
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
        className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-4 shadow-soft transition duration-200 sm:max-w-md ${
          copy.tone
        } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-current opacity-90" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{copy.title}</p>
            <p className="mt-1 text-sm leading-6 text-current/90">{copy.message}</p>
            {notice === 'added' && noticeTarget ? (
              <div className="mt-3 text-sm">
                <Link
                  href={noticeTarget}
                  className="font-bold text-current underline decoration-current/50 underline-offset-4 transition hover:decoration-current"
                >
                  Listeye
                </Link>{' '}
                git
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/20 text-lg text-current/80 transition hover:bg-black/10 hover:text-current"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
