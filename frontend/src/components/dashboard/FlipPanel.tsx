'use client';

import { useState } from 'react';

type Props = {
  frontTitle: string;
  backTitle: string;
  minHeight?: number;
  front?: React.ReactNode;
  back?: React.ReactNode;
};

export default function FlipPanel({
  frontTitle,
  backTitle,
  minHeight = 260,
  front,
  back,
}: Props) {
  const [swapped, setSwapped] = useState(false);

  return (
    <section className={`swap ${swapped ? 'is-swapped' : ''}`} style={{ minHeight }}>
      <div className="swap-inner">
        <div className="swap-face swap-front">
          {front ?? <div className="swap-title">{frontTitle}</div>}
        </div>
        <div className="swap-face swap-back">
          {back ?? <div className="swap-title">{backTitle}</div>}
        </div>
      </div>

      <button
        type="button"
        className="swap-tab"
        onClick={() => setSwapped(v => !v)}
        aria-pressed={swapped}
        aria-label={`Show ${swapped ? frontTitle : backTitle}`}
      >
        Click to flip
      </button>
    </section>
  );
}
