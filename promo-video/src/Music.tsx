import {Audio} from '@remotion/media';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {clamp} from './brand';
import {MUSIC_FILE, MUSIC_START_IN_TRACK, toFrames} from './timing';

/** Linear gain for the bed. The track is mastered loud; this lands the film near −16 LUFS. */
const MUSIC_GAIN = 0.45;

/**
 * The music bed: enters on a short fade, fades out over the last 1.8 s
 * (quadratic, so the tail dies away instead of stopping).
 */
export const Music: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	const fadeIn = toFrames(0.4, fps);
	const fadeOut = toFrames(1.8, fps);

	return (
		<Audio
			name="Music: The Upbeat Inspiring Corporate"
			src={staticFile(MUSIC_FILE)}
			trimBefore={toFrames(MUSIC_START_IN_TRACK, fps)}
			durationInFrames={durationInFrames}
			volume={(f) => {
				const enter = interpolate(f, [0, fadeIn], [0, 1], clamp);
				const leave = interpolate(f, [durationInFrames - fadeOut, durationInFrames - 1], [1, 0], clamp);
				return MUSIC_GAIN * enter * leave * leave;
			}}
		/>
	);
};
