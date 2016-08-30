var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

var paths = ['Scripts/**/*.js', '!Scripts/**/*.min.js'];

gulp.task('minify', function () {
    return gulp.src(paths)
      .pipe(uglify())
      .pipe(rename({
          extname: ".min.js"
      }))
      .pipe(gulp.dest('Scripts/.'));
});