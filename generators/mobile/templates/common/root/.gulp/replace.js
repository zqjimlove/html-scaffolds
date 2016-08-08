/**
 * 压缩 模块
 */

var replace = require('gulp-replace'),
    path = require('path');



module.exports = function(gulp, taskName) {
    var dest = path.join(gulp.projectConfig.getOutputStaticsPath());
    var CDN = gulp.projectConfig.cdn;

    var main = function() {
        gulp.src(path.join(dest, '/**/*.js'), { base: dest })
            .pipe(replace(/('|")([^=\s]*?\.?\/?)statics\/(.*?)('|")/g, '$1' + (CDN ? CDN : '$2') + 'statics/$2$3'))
            .pipe(gulp.dest(dest));

        gulp.src(path.join(dest, '/**/*.html'), { base: dest })
            .pipe(replace(/('|")([^=\s]*?\.?\/?)statics\/(.*?)('|")/g, '$1' + (CDN ? CDN : '$2') + 'statics/$3$4'))
            .pipe(replace(/\.(js|css)("|')/g, '.$1?v=' + Date.now() + '$2'))
            .pipe(gulp.dest(dest));
    };

    return [
        taskName ? taskName : 'replace',
        main
    ];
}
