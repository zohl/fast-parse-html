var benchmark = require('htmlparser-benchmark');
var parseHTML = require('../lib/fast-parse-html.min.js').parseHTML;

const target = process.argv[2];
const penalty = 1000;

var bench = benchmark(function(html, callback) {
  var result = parseHTML(html, {
    allowMismatchedTags: true
	, allowSyntaxErrors: true
	, allowCData: true
	, allowIETags: true
	, allowXMLDeclarations: true
  });
  var failed = (result instanceof Error);

  if (target == '--completeness') {
    callback(failed ? result : undefined);
  }
  else if (target == '--speed') {
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
