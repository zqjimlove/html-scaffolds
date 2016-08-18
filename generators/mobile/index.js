(function() {
    'use strict';
    var fs = require('fs');
    var join = require('path').join;
    var yeoman = require('yeoman-generator');
    var yosay = require('yosay');
    var chalk = require('chalk');
    var http = require('http');
    var UglifyJS = require("uglify-js");

    var Super = module.exports = yeoman.Base.extend({
        constructor: function() {
            yeoman.Base.apply(this, arguments);

            this.pkg = require('../../package.json');
            this.sourceRoot(join(__dirname, 'templates/common'));

            this.appConfig = {
                src: 'webapp', // 项目源代码
                build: 'release', // 项目线上编译版本
                staging: "staging", // 项目测试服务器编译版本
                statics: 'statics', //静态资源存放路径
                tmp: '.tmp' //临时目录路径
            };
        }
    });

    Super.prototype.welcome = function welcome() {
        if (!this.options['skip-welcome-message']) {
            this.log(yosay("Hello, and welcome to my super generator full of Mobile WebApp! Qishi wo hui shuo zhongwen la"));
        }
        this.log(chalk.white(chalk.bgCyan('欢迎使用超级课程表项目脚手架快速生成，如有疑问或建议可访问：' + chalk.red('http://192.168.0.30:81/frontend/scaffolds/tree/master') + ' 创建Issues告知我们.')));
    };

    Super.prototype.askForProjectName = function askForProjectName() {
        var cb = this.async();
        this.prompt([{
            type: 'input',
            name: 'projectName',
            message: '项目名称(英文)',
            default: 'new-project'
        }], function(props) {
            this.projectName = props.projectName;
            cb();
        }.bind(this));
    };

    Super.prototype.askForCssModules = function() {
        var cb = this.async();
        var prompts = [{
            type: 'checkbox',
            name: 'modules',
            message: '选择采用哪种CSS预编译引擎\n',
            choices: [{
                value: 'scss',
                name: 'Scss',
                checked: true
            }, {
                value: 'postcss',
                name: 'PostCss',
                checked: false
            }]
        }];

        this.prompt(prompts, function(props) {
            var hasMod = function(mod) {
                return props.modules.indexOf(mod) !== -1;
            };
            this.scss = hasMod('scss');
            this.postcss = hasMod('postcss');
            cb();
        }.bind(this));
    }

    Super.prototype.askForModules = function askForModules() {
        var cb = this.async();
        var prompts = [{
            type: 'checkbox',
            name: 'modules',
            message: '选择安装需要的库或控件，将会自动下载到根本目录下的 bower_components。\n',
            choices: [{
                value: 'slipModule',
                name: 'slip.js 整屏滑动、轮播图片控件',
                checked: false
            }, {
                value: 'photoSwipeModule',
                name: 'photoSwipe.js 弹窗图片展示',
                checked: false
            }, {
                value: 'shakeModule',
                name: 'shake.js 摇一摇',
                checked: false
            }]
        }];

        this.prompt(prompts, function(props) {
            var hasMod = function(mod) {
                return props.modules.indexOf(mod) !== -1;
            };
            this.slipModule = hasMod('slipModule');
            this.photoSwipeModule = hasMod('photoSwipeModule');
            this.shakeModule = hasMod('shakeModule');

            cb();
        }.bind(this));
    };


    Super.prototype.packageFiles = function packageFiles() {
        this.template('root/gitignore', '.gitignore');
        this.template('root/project.config.js', 'project.config.js');
        this.template('root/_gulpfile.js', 'gulpfile.js');
        this.template('root/_package.json', 'package.json');
        this.template('root/_bower.json', 'bower.json');
        this.template('root/_bowerrc', '.bowerrc');
        this.template('root/README.md', 'README.md');
    };

    Super.prototype.staticsFiles = function staticsFiles() {
        var _self = this;
        //scss
        var scssSource = join(__dirname, 'templates/scss');
        var scss = join(this.appConfig.src, this.appConfig.statics, "scss");
        this.directory(scssSource, scss);

        //scrips
        var scriptsSource = join(__dirname, 'templates/scripts');
        var scripts = join(this.appConfig.src, this.appConfig.statics, "scripts");
        this.directory(scriptsSource, scripts);

        //html
        var htmlSource = join(__dirname, 'templates/html');
        var htmls = join(this.appConfig.src);
        this.directory(htmlSource, htmls);

        //.gulp
        var gulpIncludeFile = join(__dirname, 'templates/common/root/.gulp');
        var gulps = join('.gulp');
        this.directory(gulpIncludeFile, gulps);

        //create dir
        if (fs.existsSync(this.appConfig.src)) return;
        fs.mkdirSync(join(this.appConfig.src));
        fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics));
        fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'scripts'));
        if (this.scss) {
            fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'scss'));
        }
        if (this.postcss) {
            fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'postcss'));
        }

        fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images'));
        fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images-source'));
        fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images-source', 'icon'));
    };

    Super.prototype.install = function install() {
        var _self = this;
        // this.installDependencies({
        //     skipMessage: this.options['skip-install-message'],
        //     skipInstall: this.options['skip-install'],
        //     bower: false,
        //     npm: false,
        //     callback: function() {
        //         _self.on('end', function() {
        //             this.log("\n\n" + chalk.bgGreen(chalk.dim('初始化成功，现在就去开发吧。')));
        //         });
        //     }
        // });
    };
})();
