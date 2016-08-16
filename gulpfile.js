var gulp = require('gulp'),
	jade = require('gulp-jade'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	gulpSequence = require('gulp-sequence'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	inject = require('gulp-inject'),
  series = require('stream-series'),
	coffee = require('gulp-coffee'),
	debug = require('gulp-debug'),
  mainBowerFiles = require('main-bower-files'),
  clean = require('gulp-clean'),
	browserSync = require('browser-sync').create();


/*********************************************************************

Generic Tasks

**********************************************************************/
gulp.task('sync', function (cb) {  
    // setTimeout could be any async task
    setTimeout(function () {
        cb();
    }, 2000);
});

/*********************************************************************

Assets Tasks

**********************************************************************/


gulp.task('copy-fonts-release', function(cb) {
   gulp.src('./src/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('./release/fonts'));
   cb();
});

gulp.task('copy-fonts-dev', function() {
   gulp.src('./src/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(plumber())
   .pipe(gulp.dest('./dev/fonts'));
});


gulp.task('copy-img-release', function(cb) {
   gulp.src('./src/img/*.*')
   .pipe(gulp.dest('./release/img'));
   cb();
});

gulp.task('copy-img-dev', function() {
   gulp.src('./src/img/*.*')
   .pipe(plumber())
   .pipe(gulp.dest('./dev/img'));
});



/*********************************************************************

Html Tasks

**********************************************************************/

gulp.task('jade-release', function(cb) {


	gulp.src('./src/jade/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./release/'))
    .pipe(inject(gulp.src(['./release/js/**/*.js', './release/css/**/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./release/'));
    cb();
});


gulp.task('jade-dev', function() {

  var vendorStream = gulp.src(['./dev/vendor/**/*.js'], {read: false});
  var appStream = gulp.src(['./dev/js/*.js'], {read: false});


	gulp.src('./src/jade/**/*.jade')
	.pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('./dev/'))
    .pipe(inject(series(vendorStream, appStream), {relative:true}))
    .pipe(inject(gulp.src(['./dev/**/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./dev/'))
    .pipe(browserSync.stream());
});


gulp.task('inject-dev',['jade-dev'], function () {
   gulp.src('./dev/**/*.html')
  .pipe(inject(gulp.src(['./dev/**/*.js', './dev/**/*.css'], {read: false}), {relative: true}))
  .pipe(gulp.dest('./dev'))
  .pipe(browserSync.stream());
});


gulp.task('html-release', gulpSequence('sync','jade-release'));



/*********************************************************************

CSS Tasks

**********************************************************************/


gulp.task('sass-tmp', function (cb) {
   gulp.src('./src/scss/**/*.scss')
   	.pipe(sass())
    .pipe(gulp.dest('./tmp/css'))
    cb();
});

gulp.task('sass-dev', function () {
   gulp.src('./src/scss/**/*.scss')
   	.pipe(plumber())
   	.pipe(sass())
    .pipe(gulp.dest('./dev/css'));
});




gulp.task('minify-css-release', function() {

   gulp.src('./tmp/**/*.css')
   	.pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./release/css/'));
});






/*********************************************************************

Scripts Tasks

**********************************************************************/



gulp.task('coffee-dev', function() {
  gulp.src('./src/coffee/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./dev/js/'));
});

gulp.task('coffee-release', function(cb) {
  gulp.src('./src/coffee/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./tmp/js/'));
    cb();
});



gulp.task('js-uglify-release', function(){
	gulp.src('./tmp/**/*.js')
	.pipe(concat('bundle.js'))
	.pipe(uglify())
    .pipe(gulp.dest('./release/js/'));
});



/**********************************************************************

Bower Task

**********************************************************************/



gulp.task("bower-files-dev", function(){
    gulp.src(mainBowerFiles())
    .pipe(plumber())
    .pipe(gulp.dest('./dev/vendor'))
    .pipe(browserSync.stream());
});

gulp.task("bower-files-release", function(){
    gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./tmp/vendor'));
  });



/**********************************************************************

Watch Task

**********************************************************************/


gulp.task('all-dev', function(cb){
	gulpSequence('clean-dev',['sass-dev', 'bower-files-dev', 'copy-fonts-dev', 'copy-img-dev', 'coffee-dev'], 'sync', 'jade-dev')(cb);
});

gulp.task('coffee-inject-dev', function(cb){
	gulpSequence('coffee-dev', 'inject-dev')(cb);
});

gulp.task('sass-inject-dev', function(cb){
	gulpSequence('sass-dev', 'inject-dev')(cb);
});

	

gulp.task('watch', ['all-dev'], function() {

    browserSync.init({
        server: "./dev/"
    });

    gulp.watch("./src/jade/**/*.jade", ['jade-dev']);
    gulp.watch("./src/scss/**/*.scss", ['sass-inject-dev']);
    gulp.watch("./src/fonts/**/*.*", ['copy-fonts-dev']);
    gulp.watch("./src/img/**/*.*", ['copy-img-dev']);
    gulp.watch("./src/coffee/**/*.coffee", ['coffee-inject-dev']);
});



/*********************************************************************

Clean Task

*********************************************************************/


gulp.task('clean-tmp', function () {
    return gulp.src('./tmp', {read: false})
        .pipe(clean());
});

gulp.task('clean-dev', function () {
    return gulp.src('./dev', {read: false})
        .pipe(clean());
});

gulp.task('clean-release', function () {
    return gulp.src('./release', {read: false})
        .pipe(clean());
});


/*********************************************************************

Release Tasks

*********************************************************************/

gulp.task('run-release', function(){

  browserSync.init({
    server: "./release"
  });
});

gulp.task('run', gulpSequence('default','run-release'));


gulp.task('default', gulpSequence('clean-release', ['copy-fonts-release',
  'copy-img-release','bower-files-release', 'sass-tmp', 'coffee-release'], 'sync', ['js-uglify-release', 'minify-css-release'], 'sync', 'html-release','clean-tmp'));







