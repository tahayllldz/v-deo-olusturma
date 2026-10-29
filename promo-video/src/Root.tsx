import {Composition, Folder} from 'remotion';
import {LaunchReel} from './LaunchReel';
import {Closing} from './scenes/Closing';
import {Opening} from './scenes/Opening';
import {WebsiteShowcase} from './scenes/WebsiteShowcase';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="WebsiteLaunch-Reel" component={LaunchReel} durationInFrames={540} fps={30} width={1080} height={1920} />
			<Folder name="Scenes">
				<Composition id="Opening" component={Opening} durationInFrames={90} fps={30} width={1080} height={1920} />
				<Composition id="Website" component={WebsiteShowcase} durationInFrames={295} fps={30} width={1080} height={1920} />
				<Composition id="Closing" component={Closing} durationInFrames={155} fps={30} width={1080} height={1920} />
			</Folder>
		</>
	);
};
