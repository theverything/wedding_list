var gulp = require('gulp');
var counts = require('./index');

gulp.task('count', function () {
  counts();
});

// Rerun the task when a file changes
gulp.task('default', function() {
  gulp.watch('./invites.md', ['count']);
});


gulp.run('default');
