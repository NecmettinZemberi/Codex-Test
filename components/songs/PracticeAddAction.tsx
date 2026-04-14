'use client';

import { useFormStatus } from 'react-dom';
import { BaglamaStringLoader } from '@/components/ui/BaglamaStringLoader';

type PracticeAddActionProps = {
  isInPracticeList: boolean;
  idleLabel?: string;
  variant?: 'default' | 'catalog';
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

export function PracticeAddAction({
  isInPracticeList,
  idleLabel = 'Çalışma listeme ekle',
  variant = 'default',
}: PracticeAddActionProps) {
  const { pending } = useFormStatus();

  const isCatalogVariant = variant === 'catalog';
  const baseClass = isCatalogVariant
    ? 'inline-flex w-full min-w-[112px] items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out disabled:cursor-default sm:w-auto'
    : 'inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition duration-200 disabled:cursor-default disabled:translate-y-0 sm:w-auto';
  const buttonClass = isCatalogVariant
    ? pending
      ? 'border-stone-300/55 bg-stone-100/90 text-stone-700 shadow-[0_10px_24px_rgba(0,0,0,0.12)]'
      : isInPracticeList
        ? 'border-emerald-500/45 bg-emerald-500/10 text-emerald-100 shadow-[0_10px_28px_rgba(16,185,129,0.09)]'
        : 'border-accent/35 bg-accent/10 text-stone-100 hover:border-accent/65 hover:bg-accent/18 hover:text-white hover:shadow-[0_14px_34px_rgba(143,107,59,0.14)] active:bg-accent/14'
    : pending
      ? 'border-stone-300/60 bg-stone-100/90 text-stone-700 shadow-[0_10px_24px_rgba(0,0,0,0.12)]'
      : isInPracticeList
        ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-100 shadow-[0_12px_30px_rgba(16,185,129,0.15)]'
        : 'border-stone-200/85 bg-stone-100 text-stone-950 hover:-translate-y-[1px] hover:border-white hover:bg-white hover:shadow-[0_16px_34px_rgba(0,0,0,0.2)] active:translate-y-0';

  return (
    <button
      type="submit"
      disabled={pending || isInPracticeList}
      className={`${baseClass} ${buttonClass}`}
    >
      {!isCatalogVariant && (pending || isInPracticeList) ? (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100/15 text-current">
          {pending ? <BaglamaStringLoader size="compact" label="Ekleniyor" /> : <CheckIcon />}
        </span>
      ) : null}
      <span>{pending ? 'Ekleniyor...' : isInPracticeList ? 'Eklendi' : idleLabel}</span>
    </button>
  );
}
