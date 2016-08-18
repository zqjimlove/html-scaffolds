/**
 * 服务器 模块
 */

var connect = require('gulp-connect'),
    bowerArr = require('./bower'),
    path = require('path');


var server = function(gulp, taskName) {
    var production = gulp.projectConfig.production;
    /** 加载bower任务 */
    gulp.task.apply(gulp, bowerArr(gulp));

    var main = function() {

        var rootPath = production?[gulp.projectConfig.dist]:[gulp.projectConfig.src, gulp.projectConfig.temp]

        connect.server({
            port: gulp.projectConfig.port,
            host: '0.0.0.0',
            root: rootPath,
            livereload: !production,
            middleware: function(connect, o) {
                var result = [];
                var proxies = gulp.projectConfig.proxies;
                if (proxies && proxies.enable) {
                    var url = require('url');
                    var proxy = require('proxy-middleware');

                    //注入服务
                    for (var i = 0; i < proxies.servers.length; i++) {
                        var proxyServer = proxies.servers[i];
                        var options = url.parse(proxyServer.url);
                        options.route = proxyServer.route;
                        result.push(proxy(options));
                    }

                    //改头跨域
                    result.push(function(req, res, next) {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        return next();
                    });

                }
                return result;
            }
        });
        
        //检测文件变动
        gulp.watch([path.join(gulp.projectConfig.src, '/**/*.{html,js,png,gif,jpg}'),
            path.join(gulp.projectConfig.temp, '/**/*.{css,png}')
        ], function(event) {
            gulp.src(event.path).pipe(connect.reload());
        });
        //检测scss变化
        gulp.watch([path.join(gulp.projectConfig.src, '/**/*.scss')], ['scss']);

        //检测postcss变化
        gulp.watch([path.join(gulp.projectConfig.src, '/**/*.css')], ['postcss']);
    }

    var beforeTasks = production ? [] : ['bower']

    var resultArr = [
        taskName ? taskName : 'server', beforeTasks,
        main
    ];

    return resultArr;
}

server.connect = connect;

module.exports = server
