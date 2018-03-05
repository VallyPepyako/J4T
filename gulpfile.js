var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  nunjucks = require('gulp-nunjucks'),
  webpackStream = require('webpack-stream'),
  webpackConfig = require('./webpack.config.js'),
  webpack = require('webpack'),
  package = require('./package.json'),
  data = require('gulp-data'),
  customProperties = require('postcss-custom-properties'),
  postcss = require('gulp-postcss');

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('css', function () {
    var plugins = [
      customProperties({preserve: true}),
    ];
    return gulp
      .src('src/scss/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer('last 4 version'))
      .pipe(gulp.dest('app/assets/css'))
      .pipe(postcss(plugins))
      .pipe(rename({ suffix: '.min' }))
      .pipe(header(banner, { package: package }))
      .pipe(gulp.dest('app/assets/css'))
      .pipe(gulp.dest('../j4t/css'))
      .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
  return gulp
    .src('src/js/scripts.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('app/assets/js/'))
    .pipe(browserSync.reload({ stream: true, once: true }));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app",
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('nunjucks', function() {
  return gulp
    .src('src/*.html')
    .pipe(data(function() {
      return require('./app/data.json');
    }))
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({ stream: true, once: true }));
  }
);

gulp.task('default', ['css', 'js', 'browser-sync', 'nunjucks'], function () {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/components/*.js", ['js']);
    gulp.watch("src/*.html", ['nunjucks']);
    gulp.watch("src/components/*.html", ['nunjucks']);
    gulp.watch("app/*.html", ['bs-reload']);
});
