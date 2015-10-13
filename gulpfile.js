var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('default', [], function () {

  return gulp.src(['./semaphore.js'])
             .pipe(concat('semaphore.atomic-es.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest('./dest'));

});