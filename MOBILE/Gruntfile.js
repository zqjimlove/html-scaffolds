module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var appConfig = {
    app: 'webapp',
    build: 'build',
    statics: 'statics',
    tmp: '.tmp'
  };


  // Project configuration.
  grunt.initConfig({
    super: appConfig,
    bower: {
      install: {
        options: {
          targetDir: '<%= super.app %>/<%= super.statics %>/bower_components',
          copy: false,
          cleanBowerDir: false,
        }
      },
      dist: {
        options: {
          targetDir: '<%= super.build %>/<%= super.statics %>/bower_components',
          production: true,
          cleanBowerDir: true,
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= super.app %>/<%= super.statics %>',
          src: ['**/*','!scss/**', '!bower_components/**', '!scripts/**'],
          dest: '<%= super.build %>/<%= super.statics %>/'
        },{
          expand: true,
          cwd: '<%= super.app %>',
          src: ['**/*.html'],
          dest: '<%= super.build %>'
        },{
          expand: true,
          cwd: '<%= super.app %>/<%= super.statics %>/images',
          src: ['**/*'],
          dest: '<%= super.build %>/images'
        }]
      }
    },
    clean: {
      dist: ['<%= super.build %>/<%= super.statics %>/**', '<%= super.build %>/view/**'],
      server: ['<%= super.tmp %>']
    },
    watch: {
      compass: {
        files: ['<%= super.app %>/<%= super.statics %>/scss/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= super.app %>/**/*.{html,jsp}',
          '<%= super.tmp %>/**/*.css',
          '<%= super.app %>/**/*.js'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      proxies: [{
        context: '/api/',
        host: '127.0.0.1',
        port: 8080,
        changeOrigin: false
      }],
      livereload: {
        options: {
          open: false,
          middleware: function(connect) {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              connect.static(appConfig.tmp),
              connect.static(appConfig.app)
            ];
          }
        }
      }
    },
    uglify: {
      dist: {
        options: {
          sourceMap: false,
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= super.app %>/<%= super.statics %>/scripts',
          src: ['**/*.js'],
          dest: '<%= super.build %>/<%= super.statics %>/scripts'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%= super.app %>/<%= super.statics %>/scss',
        cssDir: '<%= super.app %>/<%= super.statics %>/css',
        generatedImagesDir: '<%= super.tmp %>/<%= super.statics %>/images/generated',
        imagesDir: '<%= super.app %>/<%= super.statics %>/images-source',
        javascriptsDir: '<%= super.app %>/scripts',
        fontsDir: '<%= super.app %>/styles/fonts',
        httpImagesPath: '/<%= super.statics %>/images',
        httpGeneratedImagesPath: '<%= super.build %>/<%= super.statics %>/images/generated',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          cssDir: '<%= super.build %>/statics/css',
          generatedImagesDir: '<%= super.build %>/images/generated',
          outputStyle: 'compressed'
        }
      },
      server: {
        options: {
          cssDir: '<%= super.tmp %>/<%= super.statics %>/css',
          httpImagesPath: '/<%= super.statics %>/images-source',
          httpGeneratedImagesPath: '<%= super.tmp %>/<%= super.statics %>/images/generated',
          debugInfo: true
        }
      }
    },
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
      'configureProxies:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.task.run([
      'clean:dist',
      // 'bower:dist',
      'compass:dist',
      'uglify:dist',
      'copy:dist'
    ]);
  });
};