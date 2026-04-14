'use client';

import { useFormStatus } from 'react-dom';
import { BaglamaIcon } from '@/components/ui/BaglamaIcon';
import { BaglamaStringLoader } from '@/components/ui/BaglamaStringLoader';

type PracticeAddActionProps = {
  isInPracticeList: boolean;
  idleLabel?: string;
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
}: PracticeAddActionProps) {
  const { pending } = useFormStatus();

  const buttonClass = pending
    ? 'border-stone-300/60 bg-stone-100/90 text-stone-700 shadow-[0_10px_24px_rgba(0,0,0,0.12)]'
    : isInPracticeList
      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-100 shadow-[0_12px_30px_rgba(16,185,129,0.15)]'
      : 'border-stone-200/85 bg-stone-100 text-stone-950 hover:-translate-y-[1px] hover:border-white hover:bg-white hover:shadow-[0_16px_34px_rgba(0,0,0,0.2)] active:translate-y-0';

  return (
    <button
      type="submit"
      disabled={pending || isInPracticeList}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition duration-200 disabled:cursor-default disabled:translate-y-0 sm:w-auto ${buttonClass}`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-md ${
          pending || isInPracticeList ? 'bg-emerald-100/15 text-current' : 'bg-stone-950 text-stone-100'
        }`}
      >
        {pending ? (
          <BaglamaStringLoader size="compact" label="Ekleniyor" />
        ) : isInPracticeList ? (
          <CheckIcon />
        ) : (
          <BaglamaIcon />
        )}
      </span>
      <span>{pending ? 'Ekleniyor...' : isInPracticeList ? 'Eklendi' : idleLabel}</span>
    </button>
  );
}
