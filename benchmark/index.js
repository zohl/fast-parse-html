var benchmark = require('htmlparser-benchmark');
var parseHTML = require('../lib/index.js').parseHTML;

const target = process.argv[2];
const penalty = 1000;

var bench = benchmark(function(html, callback) {
  var result = parseHTML(html, {strict: false, ieTags: true, cdata: true, xmlDeclarations: true});
  var failed = (result instanceof Error);

  if (target == '--completeness') {
    callback(failed ? result : undefined);
  }
  else if (target == '--time') {
    setTimeout(() => callback(), (failed ? penalty : 0));
  }
});

bench.on('progress', function (key) {
  console.log('finished parsing ' + key + '.html');
});

bench.on('result', function (stat) {
  console.log(stat.mean().toPrecision(6) + ' ms/file ± ' + stat.sd().toPrecision(6));
});

bench.on('error', function (err) {
  console.log(err.message);
});
