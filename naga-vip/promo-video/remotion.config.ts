/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Optional: use an already-installed Chromium instead of letting Remotion
// download its own headless shell (needed in locked-down networks).
// Windows example (PowerShell):
//   $env:REMOTION_CHROME = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
