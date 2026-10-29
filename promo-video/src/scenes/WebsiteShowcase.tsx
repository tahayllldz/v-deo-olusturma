import {Video} from '@remotion/media';
import {interpolate, interpolateColors, Interactive, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import heroCapture from '../../public/site/website-hero.capture.json';
import servicesCapture from '../../public/site/website-services.capture.json';
import {C, clamp, DOMAIN, ease, type} from '../brand';
import {BrowserFrame, PageLayer} from '../components/BrowserFrame';
import {Bars} from '../components/Glyphs';
import {Reveal} from '../components/Reveal';
import {BEAT, toFrames} from '../timing';

/**
 * The three services, verbatim from the website (beta-web:
 * src/i18n/dictionaries/tr.ts → services.items.*.name).
 */
const SERVICES = ['Web Tasarım & Geliştirme', 'Sosyal Medya Danışmanlığı', 'Profesyonel Video Reklam'] as const;

/** Settled holds in the services recording, per chapter (frame ranges from the capture guard). */
const HOLDS = [servicesCapture.labels['svc-web'], servicesCapture.labels['svc-social'], servicesCapture.labels['svc-video']];

const LAYOUT = {left: 80, browserTop: 640, browserWidth: 920, headlineTop: 452, listTop: 300, listPitch: 84};

/** Scene-local times in seconds. Beat 0 is the scene start (the music's drop). */
const T = {
	headlineIn: 1 * BEAT,
	headlineOut: 9 * BEAT - 0.4,
	services: [9 * BEAT, 12 * BEAT, 15 * BEAT],
	dissolve: 0.4,
	end: 18 * BEAT,
	exit: 18 * BEAT - 0.47,
};

/**
 * 3.0–12.8 s. The real website (a frame-by-frame recording of the production
 * build) inside a quiet browser: it rises with the drop while the page loads,
 * settles with a gentle push, then dissolves to the services chapters, closer,
 * one chapter per three beats, each named below the headline area.
 */
const WebsiteShowcaseInner: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const f = (seconds: number) => toFrames(seconds, fps);
	const W = LAYOUT.browserWidth;

	const heroStart = f(0.07);
	const heroEnd = f(T.services[0] + T.dissolve / 2);
	const chapters = T.services.map((at, i) => {
		const start = f(at - T.dissolve / 2);
		const end = i < 2 ? f(T.services[i + 1] + T.dissolve / 2) : f(T.end);
		return {start, end, trimBefore: HOLDS[i][0] + 2};
	});

	return (
		<>
			<Reveal
				at={T.headlineIn}
				out={T.headlineOut}
				style={{position: 'absolute', left: LAYOUT.left, top: LAYOUT.headlineTop, color: C.white, ...type.statement}}
			>
				Artık yayındayız.
			</Reveal>

			{SERVICES.map((name, i) => {
				const lit =
					interpolate(t, [T.services[i], T.services[i] + 0.3], [0, 1], clamp) *
					(i < 2 ? interpolate(t, [T.services[i + 1], T.services[i + 1] + 0.35], [1, 0], clamp) : 1);
				const color = interpolateColors(lit, [0, 1], [C.smoke, C.white]);
				return (
					<Reveal
						key={name}
						at={T.services[i]}
						out={T.exit}
						rise={22}
						duration={0.7}
						style={{
							position: 'absolute',
							left: LAYOUT.left,
							top: LAYOUT.listTop + i * LAYOUT.listPitch,
							display: 'flex',
							alignItems: 'center',
							gap: 24,
							color,
							...type.service,
						}}
					>
						<Bars active={i} lit={1} size={30} color={color} />
						{name}
					</Reveal>
				);
			})}

			<div
				style={{
					position: 'absolute',
					left: LAYOUT.left,
					top: LAYOUT.browserTop,
					opacity:
						interpolate(t, [0, 0.55], [0, 1], {...clamp, easing: ease.soft}) *
						interpolate(t, [T.exit, T.end], [1, 0], {...clamp, easing: ease.io}),
					translate: `0 ${interpolate(t, [0, 0.95], [90, 0], {...clamp, easing: ease.out}) + interpolate(t, [T.exit, T.end], [0, 30], {...clamp, easing: ease.io})}px`,
					// Enters at 97 %, then a gentle push (1.0 → 1.035) while the hero holds. The left edge stays on the text column.
					scale: interpolate(t, [0, 0.95, T.services[0]], [0.97, 1, 1.035], {...clamp, easing: [ease.out, ease.soft]}),
					transformOrigin: '0% 50%',
				}}
			>
				<BrowserFrame width={W} url={DOMAIN}>
					{/* Hero: the page loads inside the browser and is always shown whole. */}
					<PageLayer width={W} zoom={1} focus={[720, 450]}>
						<Video
							name="Website hero"
							src={staticFile('site/website-hero.webm')}
							from={heroStart}
							durationInFrames={Math.min(heroEnd - heroStart, heroCapture.frames)}
							muted
							style={{width: '100%', height: '100%'}}
						/>
					</PageLayer>
					{/* Services: three settled chapters of the real section, closer, dissolving on the beat. */}
					{chapters.map((c, i) => (
						<PageLayer
							key={SERVICES[i]}
							width={W}
							zoom={interpolate(t, [T.services[0] - T.dissolve / 2, T.end], [1.3, 1.42], clamp)}
							focus={[890, 434]}
							opacity={interpolate(t, [c.start / fps, c.start / fps + T.dissolve], [0, 1], {...clamp, easing: ease.soft})}
						>
							<Video
								name={`Website services: ${SERVICES[i]}`}
								src={staticFile('site/website-services.webm')}
								from={c.start}
								trimBefore={c.trimBefore}
								durationInFrames={c.end - c.start}
								muted
								style={{width: '100%', height: '100%'}}
							/>
						</PageLayer>
					))}
				</BrowserFrame>
			</div>
		</>
	);
};

export const WebsiteShowcase = Interactive.create({
	Component: WebsiteShowcaseInner,
	layout: 'absolute-fill',
});
