var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var usemin = require('gulp-usemin');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var bower = require('gulp-bower');
var cssmin = require('gulp-cssmin');
var gulpIf = require('gulp-if');
var rev = require('gulp-rev');
var minifyCSS = require('gulp-minify-css');
var express = require('gulp-express');
//var Server = require('karma').Server;

/**
 * Run test once and exit
 */
/*gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/my.conf.js',
        singleRun: true
    }, done).start();
});*/

gulp.task('copy-lib', function(){
    gulp.src('bower_components/**/**/*.*')
        .pipe(gulp.dest('build/lib'));
});

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});

gulp.task('bower', function() {
    return bower('./bower_components')
        .pipe(gulp.dest('./build/static/lib/'))
});

gulp.task('compress', function() {
  return gulp.src('/src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(gulp.dest('.public/scripts/dist'));
    
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/styles/dist'));
});

gulp.task('sass-compress', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/styles/dist'));
});

gulp.task('usemin', function() {
    return gulp.src('./src/test/**/*.html')
        .pipe(usemin({
            css: [ rev ],
        }))
        .pipe(gulp.dest('build/dist/test'));
});

gulp.task('usemin-test', function() {
    return gulp.src('./src/test/test.html')
        .pipe(usemin({
            css: [cssmin(),rev()],
            js: [uglify(), rev()],
            inlinejs: [ uglify() ],
        }))
        //.pipe(rev())
        .pipe(gulp.dest('build/dist/test/'))
});

gulp.task('usedef', function () {
    return gulp.src('./src/test/test.html')
        .pipe(useref())
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', minifyCSS()))
        // Uglifies only if it's a Javascript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('build/dist/test/'));
});

gulp.task('minifyHtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('views/**/*.ejs')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('build/views'));
});

gulp.task('clean', function () {
	return gulp.src(['dist','build'], {read: false})
		.pipe(clean());
});

gulp.task('express', function () {
    // Start the server at the beginning of the task
    express.run(['./bin/www']);

    // Restart the server when file changes
    //gulp.watch(['views/**/*.ejs'], express.notify);
    //gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);
    //Event object won't pass down to gulp.watch's callback if there's more than one of them.
    //So the correct way to use server.notify is as following:
    /*gulp.watch(['{.tmp,app}/styles/!**!/!*.css'], function(event){
        gulp.run('styles:css');
        server.notify(event);
        //pipe support is added for server.notify since v0.1.5,
        //see https://github.com/gimm/gulp-express#servernotifyevent
    });*/

    //gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    //gulp.watch(['app/images/**/*'], server.notify);
    //gulp.watch(['app.js', 'routes/**/*.js'], [express.run]);
});

gulp.task('minifyfile', ['clean','minifyHtml','compress']);