var gulp = require('gulp');

var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('serve', function (done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeater('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});

gulp.task('watch', ['serve'], function () {

  watch([
    './sample/**/.html',
    './sample/**/js/*.js',
    './sample/**/css/*.css'
  ], browserSync.reload);

});

gulp.task('default', ['watch']);
