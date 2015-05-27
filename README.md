# 前端项目脚手架

## 安装

```
npm install -g yo bower git+ssh://git@192.168.0.30:frontend/scaffolds.git
```

## 使用

```
mkdir newProject && cd newProject
yo super:mobile //移动端,桌面的暂时还木有!!!
```

## 注意事项

### 移动端

集成了一个库 Super.js 。基本功能可以去看 http://192.168.0.30:81/frontend/libary-mobile 的 README

slip.js 是单屏翻页的，但在使用的时候应该延迟 500ms 插入。

```
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