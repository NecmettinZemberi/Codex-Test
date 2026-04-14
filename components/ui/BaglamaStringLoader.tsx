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
  const stringProfiles = [
    { className: 'baglama-string-loader__string--wound-medium', groupGap: false, kind: 'wound-medium' },
    { className: 'baglama-string-loader__string--steel-fine', groupGap: false, kind: 'steel-fine' },
    { className: 'baglama-string-loader__string--wound-thick', groupGap: true, kind: 'wound-thick' },
    { className: 'baglama-string-loader__string--steel-thick', groupGap: false, kind: 'steel-thick' },
    { className: 'baglama-string-loader__string--wound-fine', groupGap: true, kind: 'wound-fine' },
    { className: 'baglama-string-loader__string--steel-fine', groupGap: false, kind: 'steel-fine' },
    { className: 'baglama-string-loader__string--steel-fine', groupGap: false, kind: 'steel-fine' },
  ] as const;
  const stringCount = stringProfiles.length;
  const center = (stringCount - 1) / 2;
  const strings = stringProfiles.map((profile, index) => {
    const distance = index - center;

    return {
      begin: `${index * -0.22 - (index % 2) * 0.08}s`,
      className: profile.className,
      groupGap: profile.groupGap,
      index,
      kind: profile.kind,
      opacity: 0.78 + Math.abs(distance) * -0.018,
    };
  });

  const waveFrames = [
    'M2 6 C18 6 26 3.2 42 3.6 S70 8.4 88 7.6 S116 6 238 6',
    'M2 6 C44 6 52 3.1 70 3.6 S100 8.5 120 7.5 S150 6 238 6',
    'M2 6 C78 6 86 3 106 3.6 S138 8.6 158 7.4 S186 6 238 6',
    'M2 6 C112 6 120 3.1 140 3.6 S172 8.5 192 7.5 S220 6 238 6',
    'M2 6 C144 6 154 3.2 174 3.7 S206 8.4 224 7.6 S234 6 238 6',
    'M2 6 C32 6 62 6 92 6 S152 6 182 6 S222 6 238 6',
    'M2 6 C18 6 26 3.2 42 3.6 S70 8.4 88 7.6 S116 6 238 6',
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
            className={`baglama-string-loader__string ${string.className} ${
              string.groupGap ? 'baglama-string-loader__string--group-gap' : ''
            }`}
            viewBox="0 0 240 12"
            preserveAspectRatio="none"
            style={
              {
                '--string-opacity': string.opacity,
              } as React.CSSProperties
            }
          >
            <path
              className="baglama-string-loader__string-core"
              d="M2 6 C22 4.9 42 4.9 62 6 S102 7.1 122 6 S162 4.9 182 6 S222 7.1 238 6"
            >
              <animate
                attributeName="d"
                dur="1.85s"
                repeatCount="indefinite"
                begin={string.begin}
                calcMode="spline"
                keyTimes="0;0.16;0.34;0.52;0.72;0.88;1"
                keySplines="0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1"
                values={waveFrames}
              />
            </path>
            {string.kind.startsWith('wound') ? (
              <path
                className="baglama-string-loader__string-wrap"
                d="M2 6 C22 4.9 42 4.9 62 6 S102 7.1 122 6 S162 4.9 182 6 S222 7.1 238 6"
              >
                <animate
                  attributeName="d"
                  dur="1.85s"
                  repeatCount="indefinite"
                  begin={string.begin}
                  calcMode="spline"
                  keyTimes="0;0.16;0.34;0.52;0.72;0.88;1"
                  keySplines="0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1;0.45 0 0.2 1"
                  values={waveFrames}
                />
              </path>
            ) : null}
          </svg>
        ))}
      </span>
    </div>
  );
}
