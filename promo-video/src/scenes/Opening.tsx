import {Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, ease, LOGO, type} from '../brand';
import {Reveal} from '../components/Reveal';

/**
 * 0–3 s. The supplied logo artwork (glass B, wordmark, floor reflection) lights
 * up on black, the same way the website's hero brings it in: fade and a slow
 * uniform scale, screen-blended with a radial edge fade. Never redrawn,
 * recoloured or given extra glow.
 */
const OpeningInner: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const t = frame / fps;
	const art = LOGO.artwork;

	return (
		<>
			<Img
				src={staticFile(art.src)}
				style={{
					position: 'absolute',
					left: (width - art.width) / 2,
					top: 610,
					width: art.width,
					height: art.height,
					mixBlendMode: 'screen',
					maskImage: 'radial-gradient(closest-side at 50% 46%, #000 60%, transparent 100%)',
					opacity:
						interpolate(t, [0, 1.6], [0.12, 1], {...clamp, easing: ease.soft}) *
						interpolate(t, [2.55, 2.95], [1, 0], {...clamp, easing: ease.io}),
					scale: interpolate(t, [0, 2.95], [0.94, 1.02], {...clamp, easing: ease.out, output: 'perceptual-scale'}),
				}}
			/>
			<Reveal
				at={0.85}
				out={2.55}
				rise={24}
				style={{position: 'absolute', left: 80, right: 80, top: 560, textAlign: 'center', color: C.white, ...type.lede}}
			>
				Yeni dijital adresimiz…
			</Reveal>
		</>
	);
};

export const Opening = Interactive.create({
	Component: OpeningInner,
	layout: 'absolute-fill',
});
