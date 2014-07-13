var gulp = require('gulp');
var counts = require('./index');

gulp.task('count', function (cb) {
  counts();
  cb();
});

// Rerun the task when a file changes
gulp.task('default', ['count'], function() {
  gulp.watch('./invites.md', ['count']);
});


gulp.run('default');
