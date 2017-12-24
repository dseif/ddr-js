var gulp = require('gulp');

gulp.task('build', function () {
    var webpack = require('webpack-stream');

    return gulp.src('js/ddr.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function() {
    var connect = require('gulp-connect');

    connect.server({
        livereload: true
    });
});
