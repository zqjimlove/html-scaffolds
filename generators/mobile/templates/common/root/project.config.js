var path = require('path');

module.exports = {
    name: "<%=projectName%>", //项目名称
    src: 'webapp', //项目源码目录
    dist: 'dist', //项目编译目录
    statics: '/statics', //项目静态文件一级子目录
    vendor: '/vendor',
    temp: '.tmp', //临时编译文件目录
    production: 0, //是否发布模式下编译
    port:'9000',//服务器端口
    //代理设置
    proxies: {
        enable: 0,
        servers: [{
            url: '',
            route: ''
        }]
    },
    /**
     * 获取编译目录
     */
    getOutputRootPath: function() {
        if (this.production) {
            return this.dist;
        } else {
            return this.temp;
        }
    },
    /**
     * 获取静态资源文件编译目录
     */
    getOutputStaticsPath: function() {
        if (this.production) {
            return path.join(this.dist, this.statics);
        } else {
            return path.join(this.temp, this.statics);
        }
    }
}
