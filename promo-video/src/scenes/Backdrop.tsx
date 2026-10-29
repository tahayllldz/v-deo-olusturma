import {Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, ease} from '../brand';
import {CLOSING_START, DROP, DURATION} from '../timing';

/**
 * The website's stage beam (beta-web FinalCta / StageBeam): a soft cone of
 * sky-blue light fading to purple, hanging from the top edge. Here it sways a
 * few degrees over the whole film, the brand kit's "slow light movement".
 * Dark during the opening (the logo artwork carries its own light), present
 * behind the website, fullest on the closing card.
 */
const BackdropInner: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const t = frame / fps;
	const beamWidth = width * 1.45;

	return (
		<>
			<div style={{position: 'absolute', inset: 0, background: C.black}} />
			<div
				style={{
					position: 'absolute',
					left: (width - beamWidth) / 2,
					top: -60,
					width: beamWidth,
					height: height + 120,
					transformOrigin: '50% 0',
					rotate: `${interpolate(t, [0, DURATION], [-3.5, 3.5], clamp)}deg`,
					opacity: interpolate(t, [DROP - 0.4, DROP + 1.2, CLOSING_START - 0.2, CLOSING_START + 1.4], [0, 0.55, 0.55, 0.8], {
						...clamp,
						easing: ease.soft,
					}),
					filter: 'blur(36px)',
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(180deg, rgba(144,172,246,0.18), rgba(149,93,176,0.06) 55%, transparent 85%)',
						clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)',
					}}
				/>
			</div>
		</>
	);
};

export const Backdrop = Interactive.create({
	Component: BackdropInner,
	layout: 'absolute-fill',
});
