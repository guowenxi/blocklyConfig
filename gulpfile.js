var gulp = require("gulp");
var babel = require("gulp-babel");
var watch = require("gulp-watch");
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var htmlMin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin');



gulp.task('@blockly', function () {
    return gulp.src([
        "./@blockly/**",
    ])
    .pipe(gulp.dest('dist/@blockly/'))
});
gulp.task('assets', function () {
    return gulp.src([
        '**/*.py',
        "blockly_uncompressed.js",
        "index.js",
        "config.js",
        '!node_modules/**',
    ])
    .pipe(gulp.dest('dist/'))
});

gulp.task('html', function () {
    return gulp.src([
        '**.html',
    ])
        // 修改为源文件 
        .pipe(htmlMin({
            minifyJS: true,
            minifyCSS: true,
            removeComments: true, //删除注释
            collapseWhitespace: true //压缩html
        }))
        .pipe(useref())
        .pipe(gulp.dest('dist/'))
});
gulp.task('media', function () {
    return gulp.src('media/**/*')
        .pipe(gulp.dest('dist/media'))
});
gulp.task("js", function () {
    return gulp.src([
        "**/*.js",
        "!blockly_uncompressed.js",
        "!index.js",
        "!config.js",
        "!gulpfile.js",
        "!node_modules/**",
        "!dist/**",
        "!@blockly/**",
    ], { sourcemaps: false }) // 输入目录
        .pipe(babel({
            presets: ['@babel/preset-env'],
        }))

        .pipe(uglify())
        .pipe(useref())
        .pipe(gulp.dest("dist/")); // 输出目录
});

gulp.task('task', gulp.series(
    '@blockly',
    'assets',
    'media',
    'html',
    'js',
    (done) => {
        done();
    }));


