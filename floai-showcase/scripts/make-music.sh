#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/make_music.py public/audio/ambient-pad.wav
