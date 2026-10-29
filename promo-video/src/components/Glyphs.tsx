import type React from 'react';

/**
 * The three equal bars of the wordmark's Ξ, as on the website (beta-web:
 * src/components/ui/Bars.tsx): Beta has exactly three services, so one lit bar
 * marks each service.
 */
export const Bars: React.FC<{readonly active: number; readonly lit: number; readonly size?: number; readonly color: string}> = ({
	active,
	lit,
	size = 30,
	color,
}) => (
	<svg viewBox="0 0 24 18" width={size} height={(size * 18) / 24} aria-hidden="true">
		{[0, 1, 2].map((i) => (
			<rect key={i} x="0" y={i * 7.5} width="24" height="3" fill={color} opacity={i === active ? lit : 0.22} />
		))}
	</svg>
);

/** The website's CTA glyph: the rounded triangle drawn from the B's loops. */
export const Pointer: React.FC<{readonly size?: number; readonly color: string}> = ({size = 18, color}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
		<path d="M5 6.2 L5 17.8 Q5 21 7.8 19.4 L18.2 13.6 Q21 12 18.2 10.4 L7.8 4.6 Q5 3 5 6.2 Z" fill={color} />
	</svg>
);

export const Lock: React.FC<{readonly color: string}> = ({color}) => (
	<svg width={11} height={14} viewBox="0 0 11 14" aria-hidden="true">
		<rect x="0.5" y="6" width="10" height="7.5" rx="1.6" fill={color} />
		<path d="M2.6 6V4.2a2.9 2.9 0 0 1 5.8 0V6" fill="none" stroke={color} strokeWidth="1.3" />
	</svg>
);
