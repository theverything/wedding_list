var co = require('co');
var fs = require('fs');
var chalk = require('chalk');
var yesRegex = /^\s*\-.*\[(\d+)\]/im;
var maybeRegex = /^\s*\-.*\[(\d+)\?\]/im

var readFile = function (path, opts) {
  return function (cb) {
    fs.readFile(path, opts, cb);
  };
};

var parse = function (data) {
  var lines = data.split("\n");
  var counts = {
    yes: [],
    maybe: []
  };

  lines.forEach(function (line) {
    var yesMatch = line.match(yesRegex);
    var maybeMatch = line.match(maybeRegex);

    if (yesMatch && yesMatch.length) {
      counts.yes.push(parseInt(yesMatch[1]));
    }

    if (maybeMatch && maybeMatch.length) {
      counts.maybe.push(parseInt(maybeMatch[1]));
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

  console.log(chalk.red("##### WEDDING COUNTS #####"));
  console.log(chalk.green("Yes: %s"), sums.yes)
  console.log(chalk.yellow("Maybe: %s"), sums.maybe)
  console.log(chalk.blue("------------\nTotal: %s\n"), sums.total)
});
