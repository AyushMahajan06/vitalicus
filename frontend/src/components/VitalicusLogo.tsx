import React, { useId } from "react";

/**
 * VitalicusLogoIcon
 * A React component rendering only the Vitalicus logo icon (circular pulse waveform)
 * without glow.
 *
 * Props
 * - size: number (icon diameter in px) — default 88
 * - gradientFrom: string — start color of gradient — default "#3B82F6" (blue)
 * - gradientTo: string — end color of gradient — default "#C026D3" (magenta)
 */
export default function VitalicusLogoIcon({
  size = 88,
  gradientFrom = "#3B82F6",
  gradientTo = "#C026D3",
}: {
  size?: number;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const gradId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Vitalicus logo icon"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>

      {/* Outer circular monitor ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Baseline track */}
      <path
        d="M14 50 H86"
        stroke={`url(#${gradId})`}
        strokeOpacity="0.15"
        strokeWidth="3"
        fill="none"
      />

      {/* Vital waveform */}
      <path
        d="M18 50 L35 50 L42 34 L50 66 L57 41 L66 50 L82 50"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// Utility: convert hex to rgba with fallback for non-hex inputs
function hexToRgba(hex: string, alpha = 1) {
  // If already looks like rgb/rgba/color keyword, just return it with alpha ignored
  if (/^(rgb|hsl|#)/i.test(hex) === false) return hex;
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
