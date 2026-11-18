#!/bin/sh
# Builds both music beds (length, end-card time) and normalizes them to -14 LUFS.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/audio
build() {
  python3 scripts/make-music.py "$1" "$2" "public/audio/$3.raw.wav"
  ffmpeg -hide_banner -loglevel error -y -i "public/audio/$3.raw.wav" \
    -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 "public/audio/$3.wav"
  rm "public/audio/$3.raw.wav"
}
build 30 27.0667 bed-promo &
build 26.5334 23.6 bed-vertical &
wait
