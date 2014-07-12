var co = require('co');
var fs = require('fs');
var yesRegex = /^\s*\-.*\[(\d+)\]/im;
var maybeRegex = /^\s*\-.*\[(\d+)\?\]/im

var readFile = function (path, opts) {
  return function (cb) {
    fs.readFile(path, opts, cb);
  };
};

var parse = function (data) {
  var lines = data.split("\n");
  var yesCounts = [];
  var maybeCounts = [];
  var counts = {
    yes: yesCounts,
    maybe: maybeCounts
  };

  lines.forEach(function (line) {
    var yesMatch = line.match(yesRegex);
    var maybeMatch = line.match(maybeRegex);

    if (yesMatch && yesMatch.length) {
      yesCounts.push(parseInt(yesMatch[1]));
    }

    if (maybeMatch && maybeMatch.length) {
      maybeCounts.push(parseInt(maybeMatch[1]));
    }
  });

  return function (cb) {
    cb(null, counts);
  };
};

var sumUp = function (counts) {
  var results = {};
  var sum = function (prev, cur) {
    return prev + cur;
  };

  results.yes = counts.yes.reduce(sum);
  results.maybe = counts.maybe.reduce(sum);
  results.total = results.yes + results.maybe;

  return function (cb) {
    cb(null, results)
  }
};

module.exports = co(function *() {
  var data = yield readFile('./invites.md', {encoding: 'utf8'});
  var counts = yield parse(data);
  var sums = yield sumUp(counts);
  console.log("## WEDDING COUNTS ##\nYes: %s\nMaybe: %s\nTotal: %s", sums.yes, sums.maybe, sums.total);
});
