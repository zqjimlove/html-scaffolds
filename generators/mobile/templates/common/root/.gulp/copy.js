/**
 * SCSS编译 模块
 */

var gulpCopy = require('gulp-copy'),
    path = require('path');



module.exports = function(gulp, taskName) {
    var dest = path.join(gulp.projectConfig.getOutputStaticsPath()),
        webappPath = gulp.projectConfig.src;

    var copyVendor = function() {
        gulp.src(path.join(webappPath, '/statics/vendor/*')).pipe(gulp.dest(path.join(dest, '/statics/vendor/')))
    }

    var copyHtml = function() {
        gulp.src(path.join(webappPath, '/**/*.html'), { base: webappPath }).pipe(gulp.dest(gulp.projectConfig.getOutputPath()));
    }

    var copyOther = function() {
        gulp.src([path.join(webappPath, '/statics/**/*'), path.join('!' + webappPath, '/statics/{scss,postcss,images-source}{,/**}')], { base: path.join(webappPath, '/statics') })
            .pipe(gulp.dest(path.join(dest)));
    }

    return [
        taskName ? taskName : 'copy',
        function() {
            copyOther();
        }
    ]
}
