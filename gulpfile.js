var gulp = require('gulp');

gulp.task('count', function () {
  require('./index')();
});

// Rerun the task when a file changes
gulp.task('default', function() {
  gulp.watch('./invites.md', ['count']);
});


gulp.run('default');
