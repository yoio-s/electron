// function defaultTask(cb) {
//     // place code for your default task here
//     cb();
// }
//
// exports.default = defaultTask

// var gulp = require('gulp')


// var gulp = require('gulp'),
//     uglify = require('gulp-uglify'),
//     minifycss = require('gulp-csso'),
//     imgmin = require('gulp-imagemin'),
//     gutil = require('gulp-util'),
//     watchPath = require('gulp-watch-path'),
//     combiner = require('stream-combiner2'),
//     pug = require('gulp-pug'),
//     sass = require('gulp-sass'),
//     rename = require('gulp-rename'),
//     notify = require('gulp-notify'),
//     plumber = require('gulp-plumber');
//
//
//
// var paths = {
//     // css
//     sassWatch: 'src/**/*.scss',
//     css: 'src/**/*.css',
//     // html
//     pugWatch: 'src/pug/*.pug',
//     pugWatch2: 'src/**/*.pug',
//     html: 'src/html'
// };
//
// // var handleError=function(err){
// //     console.log('\n');
// //     gutil.log('fileName: '+gutil.colors.red(err.fileName));
// //     gutil.log('lineNumber: '+gutil.colors.red(err.lineNumber));
// //     gutil.log('message: ' + err.message);
// //     gutil.log('plugin: ' + gutil.colors.yellow(err.plugin));
// // };
//
// gulp.task('pug', function () {
//     return gulp.src(paths.pugWatch)
//         .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//         .pipe(rename(function(path){
//             var filename = path.basename.split('_')[1];
//             if(!filename) {
//                 return path;
//             }
//             path.basename = filename;
//             return path;
//         }))
//         .pipe(pug({
//             pretty: true
//         }))
//         .pipe(gulp.dest(paths.html))
// });
//
// gulp.task('sass', function () {
//     return gulp.src(paths.sassWatch)
//         .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//         .pipe(sass({outputStyle: 'expanded'}))
//         .pipe(gulp.dest(paths.css))
// });
//
// gulp.task('watch', ['sass'], function () {
//     gulp.watch(paths.pugWatch2, ['pug']);
//     gulp.watch(paths.sassWatch, ['sass']);
// });
//
// gulp.task('default', ['watch', 'pug' ]);

// gulp.task('script',function(){//script时自定义的
// //将文件的源路径和发布路径赋值给相应变量
//     var srcJsPath='src/js/*.js';
//     var destJsPath='dist/js/';
//     var combined = combiner.obj([
//         gulp.src(srcJsPath),//获取文件源地址
//         uglify(),//执行压缩
//         gulp.dest(destJsPath)//将压缩的文件发布到新路径
//     ]);
//     combined.on('error', handleError);//打印错误日志
// });
//
// gulp.task('watchjs',function(){
//     gulp.watch('src/js/*.js',function(event){
//         var paths=watchPath(event,'js/','dist/js/');
//         //打印修改类型和路径
//         gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
//         gutil.log('Dist: ' + paths.distPath);
//         //获取错误信息，继续执行代码
//         var combined = combiner.obj([
//             gulp.src(paths.srcPath),
//             uglify(),
//             gulp.dest(paths.distDir)
//         ]);
//         combined.on('error', handleError);
//     });
// });
//
// gulp.task('default',function(){
//     //默认执行的方法，引号内的内容对应上面task写的内容
//     gulp.run('watchjs','css','images');
//     //监控js
//     gulp.watch('src/js/*.js',['watchjs']);
//     //监控css
//     gulp.watch('src/css/*.css',['css']);
//     //监控img
//     gulp.watch('src/images/*.*',['images']);
// });
//
// //注意src的参数
// gulp.task('distCopyEclipse',function(){
//     return gulp.src('src/cssEclispe/*',{nodir:true})
//         .pipe(cached('distCopyEclipse'))
//         .pipe(gulp.dest('D:/workSpace/makerplateform/webapp/instantcommunication/theme/css'))
//         .pipe(gulp.dest('D:/tomcat7/webapps/makerplateform/instantcommunication/theme/css'));
// });

const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');    //把css代码优化
const concat = require('gulp-concat');    //合并代码
const autoprefixer = require('gulp-autoprefixer'); //自动补全浏览器的前缀

const babel = require('gulp-babel');  //将es6转换成es5

const uglify = require('gulp-uglify'); //压缩js文件

const htmlMinify = require("gulp-html-minify"); //压缩html文件

const smushit = require('gulp-smushit'); //压缩图片

const livereload = require('gulp-livereload'); //修改代码自动编译

const connect = require('gulp-connect'); // 热加载

const gulpPug = require('gulp-pug');  //添加pug
//
// const path = require('path');
//
// const gutil = require('gulp-util');
//
// const electron = require('electron-connect').server.create();
//
// const gulp = require("gulp");
//
// var ROOT_PATH = path.resolve(__dirname);
// var APP_PATH = path.resolve(ROOT_PATH, 'app');
//
// // main process 的编译
// gulp.task('babel:electron-main', function () {
//     return gulp.src([APP_PATH + '/main.js', APP_PATH + '/main/**/*.js'], { base: APP_PATH })
//         .pipe(babel())
//         .pipe(gulp.dest('dist'));
// });
//
// gulp.task('watch:electron', function () {
//     electron.start();
//     gulp.watch(['./app/src/main.js', './app/src/main/**/*.js'], electron.restart);
//     gulp.watch(['./app/dist/**/*.{html,js,css}'], electron.reload);
// });

function pug() {
    return src('src/pug/*.pug')
        .pipe(gulpPug())
        .pipe(dest('src'))
}

function css() {
    // src你要操作的文件夹的位置，* 是通配符表示src/css文件夹下的所有以.css结尾的文件
    return src('src/sass/*.scss')
        .pipe(sass())
        .pipe(dest('src/css'))
    //dest是指你输出文件的位置，如果你的项目内没有css文件夹，将会帮你自动生成这个文件夹
}



function cssMinify() {
    return src('src/css/*.css')
        .pipe(concat('all.min.css'))
        .pipe(autoprefixer({
            cascade: true, //是否美化属性值 默认：true 像这样
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifyCSS())
        .pipe(dest("dist/css"))
}

function js(){
    return src('src/js/*.js')
        .pipe(concat('all.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('dist/js'))
}

function html(){
    return src('src/*.html')
        .pipe(htmlMinify())
        .pipe(dest('dist'))
}

function image(){
    return src('src/image/*')
        .pipe(smushit())
        .pipe(dest('dist/image'))
}

function watches(){
    livereload.listen();
    watch(['src/sass/*.scss'], series(css,cssMinify))
    watch(['src/css/*.css'], series(cssMinify))
    watch(['src/js/*.js'], parallel(js))
    watch(['src/pug/*.pug'], parallel(pug))
    watch(['src/index.html'], parallel(html))
    watch(['src/image/*'], parallel(image))
}

function server(){
    connect.server({
        root: 'dist/',  //再dist文件夹下查找资源
        port: 8890, //浏览器内打开的端口号
        livereload: true //是否实时刷新
    })
    watch(['src/sass/*.scss'], series(css,cssMinify))
    watch(['src/css/*.css'], series(cssMinify))
    watch(['src/pug/*.pug'], parallel(pug))
    watch(['src/js/*.js'], parallel(js))
    watch(['src/index.html'], parallel(html))
    watch(['src/image/*'], parallel(image))
}

exports.css = css;

exports.image = image

exports.html = html

exports.js = js

exports.pug = pug


exports.cssMin = series(css, cssMinify); //series是让这两个任务串行执行
exports.cssHtml = series(pug, html);
exports.default = parallel(this.cssMin,js,this.cssHtml,image) //parallel()代表并行执行这些个任务
exports.watch = series(this.default,watches)
exports.server = series(this.default,server)
