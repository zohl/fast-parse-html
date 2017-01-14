var benchmark = require('htmlparser-benchmark');
var parseHTML = require('../lib/index.js').parseHTML;

var bench = benchmark(function (html, callback) {
  var result = parseHTML(html);
  callback((result instanceof Error) ? result : undefined);
});

bench.on('progress', function (key) {
  console.log('finished parsing ' + key + '.html');
});

bench.on('result', function (stat) {
  console.log(stat.mean().toPrecision(6) + ' ms/file ± ' + stat.sd().toPrecision(6));
});

bench.on('error', function (err) {
  console.log(err);
});
