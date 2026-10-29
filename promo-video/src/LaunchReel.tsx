import {Track, useVideoConfig} from 'remotion';
import {Music} from './Music';
import {Backdrop} from './scenes/Backdrop';
import {Closing} from './scenes/Closing';
import {Opening} from './scenes/Opening';
import {WebsiteShowcase} from './scenes/WebsiteShowcase';
import {CLOSING_START, OPENING_END, toFrames} from './timing';

/**
 * "Dijital evimiz yayında." Beta Studio website launch reel, 18 s, 9:16.
 *   0.0–3.0   logo artwork · "Yeni dijital adresimiz…"
 *   3.0–7.9   the real site loads in a browser · "Artık yayındayız."
 *   7.9–12.8  closer on the services section · the three services
 *   12.8–18   lockup · line · betastudiocy.com · "Şimdi keşfedin"
 */
export const LaunchReel: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	const websiteStart = toFrames(OPENING_END, fps);
	const closingStart = toFrames(CLOSING_START, fps);

	return (
		<>
			<Track name="Backdrop">
				<Backdrop name="Stage beam" durationInFrames={durationInFrames} />
			</Track>
			<Track name="Scenes">
				<Opening name="Opening" durationInFrames={websiteStart} />
				<WebsiteShowcase name="Website" from={websiteStart} durationInFrames={closingStart - websiteStart} />
				<Closing name="Closing" from={closingStart} durationInFrames={durationInFrames - closingStart} />
			</Track>
			<Track name="Music">
				<Music />
			</Track>
		</>
	);
};
