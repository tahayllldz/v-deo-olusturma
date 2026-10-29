import {loadFont} from '@remotion/fonts';
import type React from 'react';
import {Easing, staticFile} from 'remotion';

/**
 * Brand kit colours (beta-web: BETA-STUDIO-BRAND-KIT/brand/BRAND-TOKENS.json)
 * plus the website's derived neutrals (beta-web: src/app/globals.css).
 * Nothing here is invented: these are the exact values the live site uses.
 */
export const C = {
	black: '#030205',
	navy: '#0B0A19',
	navy2: '#121128',
	navy3: '#1A1934',
	white: '#F0F1F6',
	mist: '#A3A9C4', // secondary text, 8.7:1 on black
	smoke: '#7A7D9C', // tertiary text, 4.9:1 on black
	electric: '#3858CD',
	sky: '#90ACF6',
	purple: '#955DB0',
	plum: '#62335C',
	coral: '#D46551',
	rose: '#E0B3B0',
} as const;

/** The site's spectrum line (nav underline, progress rails): electric → purple → coral. */
export const SPECTRUM = `linear-gradient(90deg, ${C.electric}, ${C.sky} 18%, ${C.purple} 48%, ${C.coral} 82%, ${C.rose})`;

/** The site's easing tokens (--ease-out, --ease-io, --ease-soft). */
export const ease = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	io: Easing.bezier(0.76, 0, 0.24, 1),
	soft: Easing.bezier(0.33, 1, 0.68, 1),
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Archivo variable (wght 100–900, wdth 62–125), the site's only typeface.
 * Same files as the site's @fontsource-variable/archivo 5.3.0 (SIL OFL 1.1).
 * Turkish İ, Ş, Ğ live in the latin-ext file; ı is in latin.
 */
export const FONT = 'Archivo, sans-serif';

const LATIN =
	'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
	'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

loadFont({
	family: 'Archivo',
	url: staticFile('fonts/archivo-latin-wdth-normal.woff2'),
	weight: '100 900',
	stretch: '62% 125%',
	unicodeRange: LATIN,
});
loadFont({
	family: 'Archivo',
	url: staticFile('fonts/archivo-latin-ext-wdth-normal.woff2'),
	weight: '100 900',
	stretch: '62% 125%',
	unicodeRange: LATIN_EXT,
});

/**
 * Type styles, mirroring the site's scale (globals.css: type-h1/h2, type-lede,
 * the expanded uppercase of buttons). Sizes are set for a 1080px-wide frame.
 */
export const type = {
	statement: {
		fontFamily: FONT,
		fontSize: 92,
		fontWeight: 500,
		fontStretch: '106%',
		letterSpacing: '-0.045em',
		lineHeight: 0.95,
	},
	lede: {
		fontFamily: FONT,
		fontSize: 62,
		fontWeight: 450,
		fontStretch: '102%',
		letterSpacing: '-0.03em',
		lineHeight: 1.08,
	},
	service: {
		fontFamily: FONT,
		fontSize: 56,
		fontWeight: 500,
		fontStretch: '104%',
		letterSpacing: '-0.035em',
		lineHeight: 1.05,
	},
	url: {
		fontFamily: FONT,
		fontSize: 92,
		fontWeight: 500,
		fontStretch: '104%',
		letterSpacing: '-0.04em',
		lineHeight: 1,
	},
	button: {
		fontFamily: FONT,
		fontSize: 26,
		fontWeight: 500,
		fontStretch: '118%',
		letterSpacing: '0.08em',
		lineHeight: 1,
	},
} satisfies Record<string, React.CSSProperties>;

/** The supplied logo crops (beta-web: src/lib/brand/logo-assets.json). Used as is: uniform scale only. */
export const LOGO = {
	artwork: {src: 'brand/logo-artwork-c9319bae.png', width: 900, height: 920},
	lockup: {src: 'brand/logo-lockup-c919cce2.png', width: 586, height: 310},
} as const;

/** The domain shown in the video (from the brief). */
export const DOMAIN = 'betastudiocy.com';
