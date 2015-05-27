// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-autoprefixer');

  // 项目配置文件
  var appConfig = {
    projectName: '<%= projectName %>', //项目名称，用于二级目录
    src: '<%= appConfig.src %>', // 项目源代码
    build: '<%= appConfig.build %>', // 项目线上编译版本
    staging: "<%= appConfig.staging %>", // 项目测试服务器编译版本
    statics: '<%= appConfig.statics %>', //静态资源存放路径
    tmp: '.tmp', //临时目录路径
    cdn: '', // 静态文件CDN地址
    api: '', // API的主机地址
  };


  // Project configuration.
  grunt.initConfig({
    //变量
    super: appConfig,

    //复制文件
    copy: {
      // 测试服务器版本
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= super.src %>/<%%= super.statics %>', //复制所有statics文件到staging/下
          src: ['**/*', '!scss/**', '!bower_components/**', '!scripts/**', '!images-source/**'],
          dest: '<%%= super.build %>/<%%= super.statics %>/'
        }, {
          expand: true,
          cwd: '<%%= super.src %>', //复制所有HTML文件到staging/下
          src: ['**/*.html'],
          dest: '<%%= super.build %>'
        }]
      }
    },

    // 删除文件
    clean: {
      dist: ['<%%= super.build %>'],
      server: ['<%%= super.tmp %>']
    },

    //监控文件
    watch: {
      compass: {
        files: ['<%%= super.src %>/<%%= super.statics %>/scss/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '<%%= super.src %>/**/*.{html,jsp}',
          '<%%= super.tmp %>/**/*.{css,png}',
          '<%%= super.src %>/**/*.js'
        ]
      }
    },

    //服务器
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: true
      },
      // 数据中间层
      // proxies: [{
      //   context: '/api/',
      //   host: '127.0.0.1',
      //   port: 8080,
      //   changeOrigin: false
      // }],
      livereload: {
        options: {
          open: false,
          middleware: function(connect) {
            return [
              // 数据中间层
              // require('grunt-connect-proxy/lib/utils').proxyRequest,
              function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                return next();
              },
              connect.static(appConfig.tmp),
              connect.static(appConfig.app)
            ];
          }
        }
      }
    },
    // 压缩 JS
    uglify: {
      dist: {
        options: {
          sourceMap: false,
          compress: {
            drop_console: true,
            drop_debugger: true,
            sequences: true,
            dead_code: true,
            properties: true,
            comparisons: true,
            if_return: true,
            unused: false,
          }
        },
        files: [{
          expand: true,
          cwd: '<%%= super.build %>/<%%= super.statics %>/scripts',
          src: ['**/*.js'],
          dest: '<%%= super.build %>/<%%= super.statics %>/scripts'
        }]
      }
    },
    //sass 编译
    compass: {
      options: {
        sassDir: '<%%= super.src %>/<%%= super.statics %>/scss',
        cssDir: '<%%= super.build %>/<%%= super.statics %>/css',
        generatedImagesDir: '<%%= super.build %>/<%%= super.statics %>/images/generated',
        imagesDir: '<%%= super.src %>/<%%= super.statics %>/images-source',
        javascriptsDir: '<%%= super.src %>/<%%= super.statics %>/scripts',
        httpImagesPath: '/<%%= super.statics %>/images',
        httpGeneratedImagesPath: '../images/generated',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        }
      },
      server: {
        options: {
          cssDir: '<%%= super.tmp %>/<%%= super.statics %>/css',
          generatedImagesDir: '<%%= super.tmp %>/<%%= super.statics %>/images/generated',
          debugInfo: true,
          outputStyle: 'nested'
        }
      }
    },

    // 自动修复CSS前缀
    autoprefixer: {
      options: {
        browsers: ['> 5%'],
        cascade: false
      },
      dist: {
        expand: true,
        cwd: '<%%= super.build %>/<%%= super.statics %>/css',
        src: '**/*.css',
        dest: '<%%= super.build %>/<%%= super.statics %>/css'
      }
    },
    /**
     * 替换
     * @type {Object}
     */
    replace: {
      common: {
        options: {
          patterns: [{
            match: /('")?\/?statics/g,
            replacement: function() {
              return '<%% = super.cdn %>/statics'; 
            }
          }, {
            match: /(1[29][27]\.\w{0,3}\.\w?\.\w{0,3}:?\w+)/g,
            replacement: function() {
              return '<%% = super.api %>'; 
            }
          }]
        },
        files: [{
          expand: true,
          cwd: '<%= super.build %>/',
          src: ['**/*.{js,html,css}'],
          dest: '<%= super.build %>/'
        }]
      },
      static_file_version: {
        patterns: [{
          match: /\.(js|css)/g,
          replacement: function(q, m) {
            return q + "?" + (+Date.now() / 1000).toFixed(0); // replaces "foo" to "bar"
          }
        }],
        files: [{
          expand: true,
          cwd: '<%= super.build %>/',
          src: ['**/*.{html}'],
          dest: '<%= super.build %>/'
        }]
      }
    },
    // 线程任务
    concurrent: {
      server: [
        'clean:server',
        // 'bower:install',
        'compass:server'
      ]
    }
  });

  grunt.registerTask('serve', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.task.run([
      'concurrent:server',
      // 'configureProxies:server',  // 数据层中间代理
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.task.run([
      'clean:dist',
      // 'bower:dist',
      'copy:dist',
      'compass:dist',
      'autoprefixer:dist',
      'uglify:dist'
    ]);
  });
};