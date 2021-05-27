# chrome 插件开发小记

`chrome 插件本质上就是web页面 + chrome内部api. 基于基本的html js css, 但运行在一个特殊的沙盒中, 且构成上与传统页面有所不同.`

## 基础概念

1. `manifest.json`
  与安卓应用中的manifest的作用相似,是插件的配置文件,也是项目的入口,里面配置了插件的图标,权限,快捷键以及对插件中各个页面的入口等定义

2. 组成概览

- background scripts
- content scripts
- an options page

## 开发及调试

### 使用你的chrome插件

使用 chrome扩展管理 -> 开发者模式 -> 加载已解压的扩展, 选择你的项目主目录即可(manifest文件的位置)

## 打包发布

