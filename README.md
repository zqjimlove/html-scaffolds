# 前端项目脚手架

## 安装

```sh
npm install -g yo bower git+ssh://git@192.168.0.30:frontend/scaffolds.git
```

## 使用

```sh
mkdir newProject && cd newProject

# 移动端
yo super:mobile 

# 开发
grunt serve

# 编译部署
# 需要设置gruntfile.js的appconfig中的API和CDN
grunt build

```


## 注意事项

### 移动端

集成了一个库 Super.js 。基本功能可以去看 http://192.168.0.30:81/frontend/libary-mobile 的 README。

Scss含有高清雪碧图、Flex布局等功能，详细的功能列表暂时木有自己去看或者问我吧。

slip.js 是单屏翻页的，但在使用的时候应该延迟 500ms 插入。

```javascript
setTimeout(function() {
        var slipJS = document.createElement("script");
        slipJS.src = "/statics/scripts/min.slip.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(slipJS, s);
        slipJS.onload = slipJS.onreadystatechange = function() {
            var slip = Slip(wrap, 'y')
                .webapp()
                .start(function() {
                    arrowUpElement.style.display = 'none';
                })
                .end(function() {
                    arrowUpElement.style.display = 'block';
                });
        }
    }, 500);
```

详细原因 https://github.com/binnng/slip.js/issues/11

有再补充再写吧。容我想想……

## Future

* Super.js 整合API功能，以配置文件的形式管理所有API。
* 利用配置文件形式取缔所有replace的方式。
* ……还有很多

## 参与或建议

1. 提ISSUES
2. Merge Requests
