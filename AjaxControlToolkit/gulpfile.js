var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');

var jsPaths = ['Scripts/**/*.js', '!Scripts/**/*.min.js'];
var cssPaths = ['Styles/*.css', '!Styles/*.min.css'];

gulp.task('minify-js', function () {
    return gulp.src(jsPaths)
      .pipe(uglify())
      .pipe(rename({
          extname: '.min.js'
      }))
      .pipe(gulp.dest('Scripts/.'));
});

gulp.task('minify-css', function () {
    return gulp.src(cssPaths)
      .pipe(cssmin())
      .pipe(rename({
          extname: '.min.css'
      }))
      .pipe(gulp.dest('Styles/.'));
});