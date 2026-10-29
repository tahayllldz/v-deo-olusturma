/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// The website footage is decoded in the browser. Several tabs decoding the
// 2160×1350 recordings at once stalled in software-rendered environments, so
// render with one tab (an 18 s film takes a few minutes) and a roomier timeout.
Config.setConcurrency(1);
Config.setDelayRenderTimeoutInMilliseconds(60000);

// Remotion downloads its own headless Chrome. Where that download is blocked,
// point it at a local Chromium headless shell:
//   REMOTION_BROWSER=/path/to/headless_shell npm run render
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
