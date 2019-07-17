#opencv 踩坑

`记录一下opencv4nodejs安装和使用过程的坑,方便后期查阅`
------

### 安装
> `opencv4nodejs`自己提供了一个工具[opencv-build](https://github.com/justadudewhohacks/npm-opencv-build),因此实际使用过程中无需自己安装opencv,但该工具是从源码编译安装,因此耗时较多,且容易出问题

> [官方文档](https://github.com/justadudewhohacks/opencv4nodejs)中有自己手动安装的方法,对mac用户来说相对简单,使用brew进行安装即可. 

> 当使用手动安装时,需要配置一个全局的环境变量来告诉安装脚本无需自动安装
```sh
# Setting up OpenCV on your own will require you to set an environment variable to prevent the auto build script to run:

# linux and osx:
export OPENCV4NODEJS_DISABLE_AUTOBUILD=1
# on windows:
set OPENCV4NODEJS_DISABLE_AUTOBUILD=1
# 可能会用的着的删除环境变量命令
unset OPENCV4NODEJS_DISABLE_AUTOBUILD
```

> 借助自动安装脚本时,可以指定安装的版本
```sh
export OPENCV4NODEJS_AUTOBUILD_OPENCV_VERSION=4.1.0
```
安装脚本`env.js`中有个逻辑,在环境变量中查找`OPENCV4NODEJS_AUTOBUILD_OPENCV_VERSION`,如果找不到就安装`3.4.6`,这里有个坑我设置了环境变量,当使用`npm i opencv4nodejs`安装时,找不到这个环境变量,无奈克隆了原仓库,`npm i`结果正常

> 编译报错`error: unknown type name 'constexpr'`,在c++中出现该报错一般是编译使用的c++版本的问题,此时需要的是`c++ 11`,猜测是opencv4之前使用的编译环境不同的原因,对c++了解不深,没有继续深究

> 克隆原仓库并配置默认安装版本 安装后,`opencv`编译通过,安装成功

> 之后禁止自动安装,再安装`opecv4nodejs`

> 在编译`opencv4nodejs`时可能会出现`fatal error: 'opencv2/core.hpp' file not found`
可以去`/usr/local/include/`或`/usr/lib/include/`目录确认一下是否有`opencv`的相关文件,并确认版本是否对应

