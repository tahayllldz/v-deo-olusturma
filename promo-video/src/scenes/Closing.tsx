import {Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, DOMAIN, ease, LOGO, SPECTRUM, type} from '../brand';
import {Pointer} from '../components/Glyphs';
import {Reveal} from '../components/Reveal';
import {BEAT} from '../timing';

const LOCKUP_WIDTH = 500;
const URL_TOP = 1030;

/** Scene-local times in seconds. Beat 0 is the scene start. */
const T = {
	lockup: 0.05,
	tagline: 2 * BEAT,
	url: 4 * BEAT,
	underline: 4 * BEAT + 0.3,
	cta: 5 * BEAT,
};

/**
 * 12.8–18 s. Back to the clean stage, centred like the website's own final
 * call to action: the supplied lockup, one line, the address, one action.
 * Nothing leaves: the last frame holds the address on screen.
 */
const ClosingInner: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const t = frame / fps;
	const lockup = LOGO.lockup;
	const lockupHeight = (LOCKUP_WIDTH * lockup.height) / lockup.width;

	return (
		<>
			{/* The brand rule: logo crops sit on black. A soft black pool, just the lockup's footprint, keeps the beam off it. */}
			<div
				style={{
					position: 'absolute',
					left: (width - 760) / 2,
					top: 452 + lockupHeight / 2 - 230,
					width: 760,
					height: 460,
					background: `radial-gradient(closest-side, ${C.black} 50%, rgba(3,2,5,0) 100%)`,
					opacity: interpolate(t, [0, 0.6], [0, 1], {...clamp, easing: ease.soft}),
				}}
			/>
			<Img
				src={staticFile(lockup.src)}
				style={{
					position: 'absolute',
					left: (width - LOCKUP_WIDTH) / 2,
					top: 452,
					width: LOCKUP_WIDTH,
					height: lockupHeight,
					mixBlendMode: 'screen',
					opacity: interpolate(t, [T.lockup, T.lockup + 1.0], [0, 1], {...clamp, easing: ease.soft}),
					scale: interpolate(t, [T.lockup, T.lockup + 1.4], [0.96, 1], {...clamp, easing: ease.out, output: 'perceptual-scale'}),
				}}
			/>

			<Reveal at={T.tagline} style={{position: 'absolute', left: 80, right: 80, top: 800, textAlign: 'center', color: C.white, ...type.lede}}>
				Markanızın dijital yolculuğu
				<br />
				burada başlıyor.
			</Reveal>

			<Reveal at={T.url} rise={20} style={{position: 'absolute', left: 0, right: 0, top: URL_TOP, display: 'flex', justifyContent: 'center'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{color: C.white, ...type.url}}>{DOMAIN}</div>
					<div style={{alignSelf: 'stretch', height: 3, marginTop: 26, background: 'rgba(240,241,246,0.08)'}}>
						<div
							style={{
								height: '100%',
								width: `${interpolate(t, [T.underline, T.underline + 0.7], [0, 100], {...clamp, easing: ease.out})}%`,
								background: SPECTRUM,
							}}
						/>
					</div>
				</div>
			</Reveal>

			<Reveal at={T.cta} rise={16} style={{position: 'absolute', left: 0, right: 0, top: 1232, display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						height: 76,
						padding: '0 34px 0 38px',
						borderRadius: 999,
						border: '1.5px solid rgba(240,241,246,0.28)',
						color: C.white,
						...type.button,
					}}
				>
					ŞİMDİ KEŞFEDİN
					<Pointer size={18} color={C.white} />
				</div>
			</Reveal>
		</>
	);
};

export const Closing = Interactive.create({
	Component: ClosingInner,
	layout: 'absolute-fill',
});
