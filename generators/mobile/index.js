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
				tmp: '.tmp', //临时目录路径
				cdn: '', // 静态文件CDN地址
				api: '', // API地址
			};
		}
	});

	Super.prototype.welcome = function welcome() {
		if (!this.options['skip-welcome-message']) {
			this.log(yosay("Hello, and welcome to my super generator full of Mobile WebApp! Qishi wo hui shuo zhongwen la"));
		}
		this.log(chalk.bgCyan('欢迎使用超级课程表项目脚手架快速生成，如有疑问或建议可访问：' + chalk.red('http://192.168.0.30:81/frontend/scaffolds/tree/master') + ' 创建Issues告知我们.'));
	};

	Super.prototype.askForProjectName = function askForProjectName() {
		var cb = this.async();

		this.prompt([{
			type: 'input',
			name: 'projectName',
			message: '项目名称',
			default: 'new-project'
		}], function(props) {
			this.projectName = props.projectName;
			cb();
		}.bind(this));
	};

	Super.prototype.askForAppConfig = function askForAppConfig() {
		var done = this.async();

		this.prompt([{
			type: 'confirm',
			name: 'customAppConfig',
			message: '是否自定义项目目录结构',
			default: false // Default to current folder name
		}], function(answers) {
			this.customAppConfig = answers.customAppConfig;
			done();
		}.bind(this));
	};

	Super.prototype.askForCustomAppConfig = function askForCustomAppConfig() {
		if (!this.customAppConfig) {
			return;
		}

		var done = this.async();

		this.prompt([{
			type: 'input',
			name: 'src',
			message: '源码目录',
			default: this.appConfig.src // Default to current folder name
		}, {
			type: 'input',
			name: 'build',
			message: '编译目录',
			default: this.appConfig.build // Default to current folder name
		}, {
			type: 'input',
			name: 'staging',
			message: '编译测试服务器目录',
			default: this.appConfig.staging // Default to current folder name
		}, {
			type: 'input',
			name: 'statics',
			message: '静态资源存放路径',
			default: this.appConfig.statics // Default to current folder name
		}], function(answers) {
			this.appConfig.src = answers.src;
			this.appConfig.build = answers.build;
			this.appConfig.staging = answers.staging;
			this.appConfig.statics = answers.statics;
			done();
		}.bind(this));
	};



	Super.prototype.askForModules = function askForModules() {
		var cb = this.async();

		var prompts = [{
			type: 'checkbox',
			name: 'modules',
			message: '选择安装需要的库或控件，将会自动下载到根本目录下的 bower_components。\n 由于它存在较多的额外文件，所以请自行复制进 scripts/common 并引入到库',
			choices: [{
				value: 'SuperBrowserLibsModule',
				name: 'SuperBrowserLibs 超级课程表客户端JSSDK',
				checked: false
			}, {
				value: 'slipModule',
				name: 'slip.js 整屏滑动、轮播图片控件',
				checked: false
			}, {
				value: 'iscrollModule',
				name: 'iscroll.js',
				checked: false
			}, {
				value: 'photoSwipeModule',
				name: 'photoSwipe.js 弹窗图片展示',
				checked: false
			}, {
				value: 'shakeModule',
				name: 'shake.js 摇一摇',
				checked: false
			}, ]
		}];

		this.prompt(prompts, function(props) {
			var hasMod = function(mod) {
				return props.modules.indexOf(mod) !== -1;
			};
			this.SuperBrowserLibsModule = hasMod('SuperBrowserLibsModule');
			this.slipModule = hasMod('slipModule');
			this.iscrollModule = hasMod('iscrollModule');
			this.photoSwipeModule = hasMod('photoSwipeModule');
			this.shakeModule = hasMod('shakeModule');

			cb();
		}.bind(this));
	};


	Super.prototype.packageFiles = function packageFiles() {
		this.template('root/gitignore', '.gitignore');
		this.template('root/_Gruntfile.js', 'Gruntfile.js');
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
		//
		var htmlSource = join(__dirname, 'templates/html');
		var htmls = join(this.appConfig.src);
		this.directory(htmlSource, htmls);

		//create dir

		fs.mkdirSync(join(this.appConfig.src));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'scripts'));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'scss'));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images'));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images-source'));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images-source', 'icon'));
		fs.mkdirSync(join(this.appConfig.src, this.appConfig.statics, 'images-source', 'icon-2x'));
	};


	// Super.prototype.askForZepto = function askForZepto() {
	// 	var cb = this.async();
	// 	this.prompt([{
	// 		type: 'confirm',
	// 		name: 'zepto',
	// 		message: '你要使用 Zepto 吗? ( 默认 : flase )',
	// 		default: false
	// 	}], function(props) {
	// 		if (props.zepto) {
	// 			this.log(chalk.yellow('download zeptojs ....'));
	// 			var file = fs.createWriteStream("webapp/statics/scripts/common/zepto.min.js");
	// 			var request = http.get("http://zeptojs.com/zepto.min.js", function(response) {
	// 				response.pipe(file);
	// 			});
	// 		}
	// 		cb();
	// 	}.bind(this));
	// };

	Super.prototype.install = function install() {
		var _self = this;
		this.installDependencies({
			skipMessage: this.options['skip-install-message'],
			skipInstall: this.options['skip-install'],
			bower: true,
			npm: true,
			callback: function() {
				_self._copySuperFile();
				_self.on('end', function() {
					this.log("\n\n" + chalk.bgGreen(chalk.dim('初始化成功，现在就去开发吧。')));
				});
			}
		});
	};

	Super.prototype._copySuperFile = function _copySuperFile() {
		this.copy(this.destinationPath(join('bower_components', 'SuperMobileLibary', 'dist', 'Super.js')), this.destinationPath(join(this.appConfig.src, this.appConfig.statics, 'scripts','common', 'Super.js')));
		this.copy(this.destinationPath(join('bower_components', 'SuperMobileLibary', 'dist', 'Super.css')), this.destinationPath(join(this.appConfig.src, this.appConfig.statics, 'scss', 'common', '_super.scss')));
	};
})();