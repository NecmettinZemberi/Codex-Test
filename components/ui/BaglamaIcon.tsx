type BaglamaIconProps = {
  className?: string;
};

export function BaglamaIcon({ className = 'h-3.5 w-3.5' }: BaglamaIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.2 13.4c0 2.4-1.6 4.4-3.6 4.4S1 15.8 1 13.4 2.6 9 4.6 9s3.6 2 3.6 4.4Z" />
      <path d="M6.9 11.7 18.8 4.8" />
      <path d="M8 14.7 19.9 7.8" />
      <path d="M18.8 4.8 23 3.7" />
      <path d="M19.9 7.8 23 7" />
      <path d="M17.2 5.7 20 9.2" />
    </svg>
  );
}
