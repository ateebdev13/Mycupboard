import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

// Use the pre-installed headless shell when present (cloud/CI containers).
const headlessShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(headlessShell)) {
  Config.setBrowserExecutable(headlessShell);
}

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
