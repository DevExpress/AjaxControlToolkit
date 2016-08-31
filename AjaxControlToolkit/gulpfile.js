/// <binding ProjectOpened='minify-css, minify-js' />
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

var jsPaths = ['Scripts/**/*.js', '!Scripts/**/*.min.js'];
var jsDest = 'Scripts/.';
var cssPaths = ['Styles/*.css', '!Styles/*.min.css'];
var cssDest = 'Styles/.';

gulp.task('minify-js', function () {
    return gulp.src(jsPaths)
        .pipe(plumber())
        .pipe(watch(jsPaths))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(jsDest));
});

gulp.task('minify-css', function () {
    return gulp.src(cssPaths)
        .pipe(plumber())
        .pipe(watch(cssPaths))
        .pipe(cssmin())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(cssDest));
});