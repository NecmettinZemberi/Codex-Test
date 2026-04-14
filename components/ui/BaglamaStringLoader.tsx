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
  const stringCount = 6;
  const center = (stringCount - 1) / 2;
  const strings = Array.from({ length: stringCount }, (_, index) => {
    const distance = index - center;

    return {
      begin: `${index * -0.18 - (index % 3) * 0.04}s`,
      index,
      opacity: 0.55 + Math.abs(distance) * -0.035,
    };
  });

  const waveFrames = [
    'M2 6 C22 4.9 42 4.9 62 6 S102 7.1 122 6 S162 4.9 182 6 S222 7.1 238 6',
    'M2 6 C22 6.9 42 6.9 62 6 S102 5.1 122 6 S162 6.9 182 6 S222 5.1 238 6',
    'M2 6 C22 5.1 42 6.9 62 6 S102 5.1 122 6 S162 6.9 182 6 S222 5.1 238 6',
    'M2 6 C22 6.9 42 5.1 62 6 S102 6.9 122 6 S162 5.1 182 6 S222 6.9 238 6',
    'M2 6 C22 4.9 42 4.9 62 6 S102 7.1 122 6 S162 4.9 182 6 S222 7.1 238 6',
  ].join(';');

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
        {strings.map((string) => (
          <svg
            key={string.index}
            className="baglama-string-loader__string"
            viewBox="0 0 240 12"
            preserveAspectRatio="none"
            style={
              {
                '--string-opacity': string.opacity,
              } as React.CSSProperties
            }
          >
            <path d="M2 6 C22 4.9 42 4.9 62 6 S102 7.1 122 6 S162 4.9 182 6 S222 7.1 238 6">
              <animate
                attributeName="d"
                dur="2.1s"
                repeatCount="indefinite"
                begin={string.begin}
                values={waveFrames}
              />
            </path>
          </svg>
        ))}
      </span>
    </div>
  );
}
