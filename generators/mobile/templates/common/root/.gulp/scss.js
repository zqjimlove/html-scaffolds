/**
 * SCSS编译 模块
 */

var gulpAutoprefixer = require('gulp-autoprefixer'),
    compass = require('gulp-compass'),
    changed = require('gulp-changed'),
    path = require('path');



module.exports = function(gulp, taskName) {
    var dest = path.join(gulp.projectConfig.getOutputStaticsPath(), 'css');

    var main = function() {
        gulp.src(gulp.projectConfig.src + '/**/*.scss')
            .pipe(changed(dest))
            .pipe(compass({
                style: gulp.projectConfig.production ? 'compressed' : 'nested',
                css: dest,
                sass: path.join(gulp.projectConfig.src, '/statics/scss'),
                image: path.join(gulp.projectConfig.src, '/statics/images-source'),
                generated_images_path: path.join(gulp.projectConfig.getOutputStaticsPaht(), '/images/generated')
            })).on('error', function(err) {
                console.error(err);
            }).pipe(gulpAutoprefixer('> 5%')).pipe(gulp.dest(dest));
    }

    return [
        taskName ? taskName : 'scss',
        main
    ]
}
