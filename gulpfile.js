var gulp = require('gulp'),
	jade = require('gulp-jade'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	gulpSequence = require('gulp-sequence'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	inject = require('gulp-inject'),
	coffee = require('gulp-coffee'),
	debug = require('gulp-debug'),
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
   .pipe(gulp.dest('./dist/fonts'));
   cb();
});

gulp.task('copy-fonts-dev', function() {
   gulp.src('./src/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(plumber())
   .pipe(gulp.dest('./dev/fonts'));
});


gulp.task('copy-img-release', function(cb) {
   gulp.src('./src/img/*.*')
   .pipe(gulp.dest('./dist/img'));
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
    .pipe(gulp.dest('./dist/'))
    .pipe(inject(gulp.src(['./dist/js/**/*.js', './dist/css/**/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./dist/'));
    cb();
});


gulp.task('jade-dev', function() {
	gulp.src('./src/jade/**/*.jade')
	.pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('./dev/'))
    .pipe(inject(gulp.src(['./dev/js/**/*.js', './dev/css/**/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./dev/'))
    .pipe(browserSync.stream());
});


// gulp.task('inject-release', function () {
//   gulp.src('./dist/**/*.html')
//   .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css'], {read: false}), {relative: true}))
//   .pipe(gulp.dest('./dist'));
// });

gulp.task('inject-dev',['jade-dev'], function () {
   gulp.src('./dev/**/*.html')
  .pipe(inject(gulp.src(['./dev/js/*.js', './dev/css/*.css'], {read: false}), {relative: true}))
  .pipe(gulp.dest('./dev'))
  .pipe(browserSync.stream());
});


gulp.task('html-release', gulpSequence('sync','jade-release'));



/*********************************************************************

CSS Tasks

**********************************************************************/


gulp.task('sass-build', function (cb) {
   gulp.src('./src/scss/**/*.scss')
   	.pipe(sass())
    .pipe(gulp.dest('./build/css'))
    cb();
});

gulp.task('sass-dev', function () {
   gulp.src('./src/scss/**/*.scss')
   	.pipe(plumber())
   	.pipe(sass())
    .pipe(gulp.dest('./dev/css'))
    .pipe(browserSync.stream());
});


gulp.task('copycss-build', function(cb) {
   gulp.src('./src/css/**/*.css')
   .pipe(gulp.dest('./build/css'));
   cb();
});

gulp.task('copycss-dev', function(cb) {
   gulp.src('./src/css/**/*.css')
   .pipe(gulp.dest('./dev/css'));
   cb();
});


// gulp.task('concat-css-build', function(cb) {
  	
//   	gulp.src('./build/css/**/*.css')
//     .pipe(concat('bundle.css'))
//     .pipe(gulp.dest('./build/css/'));
//     cb();
    
// });



gulp.task('minify-css-release', function() {

   gulp.src('./build/css/**/*.css')
   	.pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css/'));
});



gulp.task('css-release', function(cb){
	gulpSequence(['sass-build', 'copycss-build'], 'sync','minify-css-release');
	cb();
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
    .pipe(gulp.dest('./build/js/'));
    cb();
});

gulp.task('js-copy-dev', function() {
  	
  	gulp.src('./src/js/**/*.js')
  	.pipe(plumber())
    .pipe(gulp.dest('./dev/js/'))
    .pipe(browserSync.stream());
    
});


gulp.task('js-copy-release', function(cb){
	gulp.src('./src/js/**/*.js')
	.pipe(gulp.dest('./build/js/'));
	cb();

});

gulp.task('js-uglify-release', function(){
	gulp.src('./build/js/**/*.js')
	.pipe(concat('bundle.js'))
	.pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});



gulp.task('js-release', function(cb){
	gulpSequence(['js-copy-release', 'coffee-release'], 'sync', 'js-uglify-release');
	cb();
});




/**********************************************************************

Watch Task

**********************************************************************/


gulp.task('all-dev', function(cb){
	gulpSequence(['sass-dev', 'copycss-dev', 'js-copy-dev', 'copy-fonts-dev', 'copy-img-dev', 'coffee-dev'],'jade-dev')(cb);
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
    gulp.watch("./src/scss/**/*.scss", ['sass-inject-dev', 'copycss-dev']);
    gulp.watch("./src/js/**/*.js", ['js-copy-dev']);
    gulp.watch("./src/fonts/**/*.*", ['copy-fonts-dev']);
    gulp.watch("./src/img/**/*.*", ['copy-img-dev']);
    gulp.watch("./src/coffee/**/*.coffee", ['coffee-inject-dev']);
});




/*********************************************************************

Release Task

*********************************************************************/


gulp.task('default', gulpSequence(['copy-fonts-release','copy-img-release','css-release', 'js-release'],'html-release'));