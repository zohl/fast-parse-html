var ttest = require('ttest');
var fs = require('fs');

const fnSampleOld = process.argv[2];
const fnSampleNew = process.argv[3];

const readData = fn => fs.readFileSync(fn, 'utf8')
  .split('\n')
  .filter(s => s.length > 0)
  .map(s => s.split(' ').map(parseFloat));

const fst = ([x, _]) => x;

const sampleOld = readData(fnSampleOld).map(fst);
const sampleNew = readData(fnSampleNew).map(fst);

const mkStat = alternative => ttest(
  sampleOld
, sampleNew
, {
    mu: 0
  , alternative: alternative
  , varEqual: false
});

var stats = [
  {name: 'equal', pValue: 1 - mkStat('not equal').pValue()}
, {name: 'faster', pValue: mkStat('greater').pValue()}
, {name: 'slower', pValue: mkStat('less').pValue()}
].sort((lhs, rhs) => (lhs.pValue < rhs.pValue) ? -1 : 1);

const mean = xs => (xs.reduce((a, b) => a + b)) / xs.length;

const fmtPValue = pValue => ' (p-value = ' + pValue + ')';

console.log('New version is likely to be ' + stats[0].name
          + fmtPValue(stats[0].pValue));

console.log('Other statistics:\n' + stats.slice(1).map(s =>
  '  ' + s.name + fmtPValue(s.pValue)).join('\n'));

console.log('Old sample mean: ' + mean(sampleOld));
console.log('New sample mean: ' + mean(sampleNew));

