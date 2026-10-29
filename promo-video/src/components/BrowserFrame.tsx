import type React from 'react';
import {C, FONT} from '../brand';
import {Lock} from './Glyphs';

/** Desktop viewport the website was captured at (CSS px). */
export const VIEWPORT = {width: 1440, height: 900};

/**
 * A flat, quiet desktop browser: neutral window dots, an address field with the
 * live domain, and the page below at the captured 16:10 viewport.
 */
export const BrowserFrame: React.FC<{
	readonly width: number;
	readonly url: string;
	readonly children: React.ReactNode;
}> = ({width, url, children}) => {
	const barHeight = 52;
	const contentHeight = (width * VIEWPORT.height) / VIEWPORT.width;

	return (
		<div
			style={{
				width,
				borderRadius: 22,
				overflow: 'hidden',
				background: C.navy2,
				boxShadow: `0 60px 140px -40px rgba(0,0,0,0.95), 0 0 0 1px rgba(240,241,246,0.10), inset 0 1px 0 rgba(240,241,246,0.06)`,
			}}
		>
			<div
				style={{
					height: barHeight,
					display: 'flex',
					alignItems: 'center',
					padding: '0 22px',
					background: `linear-gradient(180deg, ${C.navy3}, ${C.navy2})`,
					borderBottom: '1px solid rgba(240,241,246,0.07)',
				}}
			>
				<div style={{display: 'flex', gap: 9, width: 90}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{width: 12, height: 12, borderRadius: 6, background: 'rgba(240,241,246,0.16)'}} />
					))}
				</div>
				<div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
					<div
						style={{
							height: 32,
							width: 420,
							borderRadius: 16,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 10,
							background: 'rgba(3,2,5,0.55)',
							border: '1px solid rgba(240,241,246,0.08)',
							fontFamily: FONT,
							fontSize: 17,
							fontWeight: 450,
							letterSpacing: '0.01em',
							color: C.mist,
						}}
					>
						<Lock color={C.smoke} />
						{url}
					</div>
				</div>
				<div style={{width: 90}} />
			</div>
			<div style={{position: 'relative', width, height: contentHeight, overflow: 'hidden', background: C.black}}>{children}</div>
		</div>
	);
};

/**
 * A full page layer inside the browser: the captured footage, zoomed in by
 * `zoom` around `focus` (CSS px of the 1440×900 viewport), never past its edges.
 */
export const PageLayer: React.FC<{
	readonly width: number;
	readonly zoom: number;
	readonly focus: readonly [number, number];
	readonly opacity?: number;
	readonly children: React.ReactNode;
}> = ({width, zoom, focus, opacity = 1, children}) => {
	const height = (width * VIEWPORT.height) / VIEWPORT.width;
	const pageW = width * zoom;
	const pageH = height * zoom;
	const left = Math.min(0, Math.max(width - pageW, width / 2 - (focus[0] / VIEWPORT.width) * pageW));
	const top = Math.min(0, Math.max(height - pageH, height / 2 - (focus[1] / VIEWPORT.height) * pageH));

	return <div style={{position: 'absolute', left, top, width: pageW, height: pageH, opacity}}>{children}</div>;
};
