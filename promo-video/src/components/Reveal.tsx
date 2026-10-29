import type React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, ease} from '../brand';

/**
 * Text enters with a fade and a short rise and leaves with a fade, the same
 * restrained treatment as the website's own promo. No masks, so no word is
 * ever sliced. Times are in seconds, relative to the enclosing scene.
 */
export const Reveal: React.FC<{
	readonly at: number;
	readonly out?: number;
	readonly rise?: number;
	readonly duration?: number;
	readonly style?: React.CSSProperties;
	readonly children: React.ReactNode;
}> = ({at, out, rise = 28, duration = 0.8, style, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const enter = interpolate(t, [at, at + duration], [0, 1], {...clamp, easing: ease.out});
	const leave = out === undefined ? 1 : interpolate(t, [out, out + 0.4], [1, 0], {...clamp, easing: ease.io});

	return (
		<div
			style={{
				...style,
				opacity: enter * leave,
				translate: `0 ${(1 - enter) * rise - (1 - leave) * 12}px`,
			}}
		>
			{children}
		</div>
	);
};
