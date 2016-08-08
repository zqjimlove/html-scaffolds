/**
 * Bower安装模块
 */

var bower = require('gulp-bower'),
    mainBowerFiles = require('main-bower-files'),
    path = require('path');


module.exports = function(gulp, taskName) {

    /** bower 安装依赖*/
    gulp.task('install-bower', function() {
        return bower('./bower_components');
    })

    return [
        taskName ? taskName : 'bower', ['install-bower'],
        function() {
            return gulp.src(mainBowerFiles()).pipe(gulp.dest(path.join(gulp.projectConfig.getOutputStaticsPath(), gulp.projectConfig.vendor)));
        }
    ]
}
