'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { BaglamaStringLoader } from '@/components/ui/BaglamaStringLoader';

type PracticeSaveActionProps = {
  itemId: string;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PracticeSaveAction({ itemId }: PracticeSaveActionProps) {
  const searchParams = useSearchParams();
  const { pending } = useFormStatus();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [saved, setSaved] = useState(false);

  const notice = searchParams.get('notice');
  const savedItem = searchParams.get('saved_item');

  useEffect(() => {
    if (notice === 'saved' && savedItem === itemId) {
      setSaved(true);
    }
  }, [itemId, notice, savedItem]);

  useEffect(() => {
    const form = buttonRef.current?.form;
    if (!form) {
      return;
    }

    const markDirty = () => setSaved(false);

    form.addEventListener('input', markDirty);
    form.addEventListener('change', markDirty);

    return () => {
      form.removeEventListener('input', markDirty);
      form.removeEventListener('change', markDirty);
    };
  }, []);

  useEffect(() => {
    if (pending) {
      setSaved(false);
    }
  }, [pending]);

  const helperText = pending
    ? 'Parça güncelleniyor. Değişiklikler güvenli şekilde kaydediliyor...'
    : saved
      ? 'Değişiklikler kaydedildi. Çalışma akışın güncel durumda.'
      : 'Durum, hedef tarih ve not değişikliklerini bu parça için ayrı kaydet.';

  const buttonClass = pending
    ? 'border-stone-300/60 bg-stone-100/90 text-stone-700 shadow-[0_10px_24px_rgba(0,0,0,0.12)]'
    : saved
      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-100 shadow-[0_12px_30px_rgba(16,185,129,0.15)]'
      : 'border-stone-200/85 bg-stone-100 text-stone-950 hover:-translate-y-[1px] hover:border-white hover:bg-white hover:shadow-[0_16px_34px_rgba(0,0,0,0.2)] active:translate-y-0';

  return (
    <div className="flex flex-col gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className={`text-sm leading-6 ${saved ? 'text-emerald-200' : 'text-muted'}`}>{helperText}</p>

      <button
        ref={buttonRef}
        type="submit"
        disabled={pending}
        className={`inline-flex min-w-[154px] items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-wait disabled:translate-y-0 ${buttonClass}`}
      >
        {pending ? <BaglamaStringLoader size="compact" label="Kaydediliyor" /> : saved ? <CheckIcon /> : null}
        <span>{pending ? 'Kaydediliyor...' : saved ? 'Kaydedildi' : 'Kaydet'}</span>
      </button>
    </div>
  );
}
