type BaglamaStringLoaderProps = {
  className?: string;
  label?: string;
  size?: 'default' | 'compact';
};

export function BaglamaStringLoader({
  className = '',
  label = 'Yükleniyor',
  size = 'default',
}: BaglamaStringLoaderProps) {
  const strings = Array.from({ length: 4 }, (_, index) => index);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`baglama-string-loader ${
        size === 'compact' ? 'baglama-string-loader--compact' : ''
      } ${className}`.trim()}
    >
      <span className="sr-only">{label}</span>
      <span className="baglama-string-loader__strings" aria-hidden="true">
        {strings.map((index) => (
          <span
            key={index}
            className="baglama-string-loader__string"
            style={{ '--string-index': index } as React.CSSProperties}
          />
        ))}
      </span>
    </div>
  );
}
