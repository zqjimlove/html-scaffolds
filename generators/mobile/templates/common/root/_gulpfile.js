var gulp = require('gulp'),
    config = require('./project.config'),
    path = require('path'),
    argv = require('yargs').argv;

//命令行配置
config.production = !!argv.production;
config.cdn = argv.cdn ? argv.cdn : false;

gulp.projectConfig = config;

gulp.task('test', function() {
    console.log(path.join(gulp.projectConfig.getOutputStaticsPath(), '/**/**/*.js'));
});


/**
 * 清空编译目录
 */
gulp.task('clean', function() {
    return gulp.src(config.getOutputRootPath()).pipe(clean());
});


/** 加载scss任务 */
<%if(scss){%>
gulp.task.apply(gulp, require('./.gulp/scss.js')(gulp));
<%}%>
<%if(postcss){%>
/** 加载postcss任务 */
gulp.task.apply(gulp, require('./.gulp/postcss.js')(gulp));
<%}%>
/** 加载压缩任务 */
gulp.task.apply(gulp, require('./.gulp/compress.js')(gulp));

/** 加载复制任务 */
gulp.task.apply(gulp, require('./.gulp/copy.js')(gulp));

/** 加载替换任务 */
gulp.task.apply(gulp, require('./.gulp/replace.js')(gulp));

/** 加载Server任务 */
var server = require('./.gulp/server.js');
gulp.task.apply(gulp, server(gulp));

/**
 * 编译任务
 */
gulp.task('build', function() {
    gulp.projectConfig.production = true;
    gulp.run(['clean', 'bower', <%if(postcss){%>'postcss',<%}%><%if(scss){%> 'scss',<%}%> 'copy', 'replace', 'compress']);
});
