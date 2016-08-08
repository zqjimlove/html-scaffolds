/**
 * Postcss编译 模块
 */

var autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    utilities = require('postcss-utilities'),
    sprites = require('postcss-sprites').default,
    changed = require('gulp-changed'),
    path = require('path');

module.exports = function(gulp, taskName) {
    var dest = path.join(gulp.projectConfig.getOutputStaticsPath(), 'css');

    var spritesConfig = {
        stylesheetPath: dest,
        spritePath: path.join(dest, '../images/generated'),
        retina: true,
        filterBy: function(image) {
            if (!/images-source/.test(image.url)) {
                return Promise.reject();
            }
            return Promise.resolve();
        },
        groupBy: function(image) {
            var arr = /^.*\/images-source\/(.*)\/(.*)\.(png|jpg)/g.exec(image.url);
            if (arr.length < 2) {
                return Promise.reject();
            } else {
                var group = arr[1].replace(/\//g, '.');
                return Promise.resolve(group);
            }
        }
    }

    var main = function() {
        var postcssPlugins = [
            precss,
            utilities,
            sprites(spritesConfig),
            autoprefixer({ browsers: ['> 5%'] })
        ];

        if (gulp.projectConfig.production) {
            postcssPlugins.push(cssnano());
        }

        gulp.src(gulp.projectConfig.src + '/**/*.css', { base: path.join(gulp.projectConfig.src, '/statics/postcss') })
            .pipe(changed(dest))
            .pipe(postcss(postcssPlugins))
            .on('error', function(err) {
                console.error(err);
            })
            .pipe(gulp.dest(dest));
    };

    return [
        taskName ? taskName : 'postcss',
        main
    ]
}
