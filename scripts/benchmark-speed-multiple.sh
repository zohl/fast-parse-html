#!/bin/sh

RESULTS="./benchmark/results"
N=20

./scripts/prepublish.sh
[ -d "$RESULTS" ] || mkdir "$RESULTS"

FN0="$(ls "$RESULTS" | tail -n 1)"
FN1="bench-$(date +'%Y-%m-%d-%H%M%S')"

for i in $(seq 1 $N); do
  node ./benchmark/index.js --speed \
  | tail -n 1 \
  | cut -d ' ' -f 1,4 >> "$RESULTS/$FN1"
done

[ -z "$FN0" ] || node ./benchmark/compare.js "$RESULTS/$FN0" "$RESULTS/$FN1"

