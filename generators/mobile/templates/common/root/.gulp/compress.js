/**
 * 压缩 模块
 */

var imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    path = require('path');



module.exports = function(gulp, taskName) {
    var dest = path.join(gulp.projectConfig.getOutputStaticsPath());
    var CDN = gulp.projectConfig.cdn;

    var main = function() {
        gulp.src(path.join(dest, '/**/*.js'), { base: dest })
            .pipe(replace(/('|")([^=\s]*?\.?\/?)statics\/(.*?)('|")/g, '$1' + (CDN ? CDN : '$2') + 'statics/$2$3'))
            .pipe(uglify())
            .pipe(gulp.dest(dest));

        gulp.src(path.join(dest, '/images/**/*.{png,jpg,gif}'), { base: dest })
            .pipe(imagemin([imageminPngquant(), imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()]))
            .pipe(gulp.dest(dest));
    };

    return [
        taskName ? taskName : 'compress',
        main
    ];
}
