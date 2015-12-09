var gulp = require('gulp');

var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('serve', function (done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['./sample'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});


gulp.task('watch', ['serve'], function () {

  watch([
    './sample/**/*.html',
    './sample/**/*.js',
    './sample/**/*.css'
  ], browserSync.reload);

});

gulp.task('default', ['watch']);
