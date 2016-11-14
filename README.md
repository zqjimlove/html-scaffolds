# 前端项目脚手架

## 安装

```sh
npm i -g yo bower git+ssh://git@192.168.0.30:frontend/scaffolds.git
```

## 使用

```sh
mkdir newProject && cd newProject

# 移动端
yo super:mobile 

# 开发服务器
gulp serve

# 编译部署
gulp build 
# 支持参数 
# [--production] 生产环境，压缩所有文件。
# [--cdn http://cdn.cn/] CDN路径，会替换所有静态文件的引用路径，如: link="../staics/css/index.css" => link="http://cdn.cn/staics/css/index.css"
```


