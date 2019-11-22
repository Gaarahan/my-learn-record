### 问题
1. sys-lib
- 图标字体 -> ux [v]
- 接口部分数据处理 [v]
- 国际化  [v]
 系统版本 ： system library version
 使用说明 ：instructions

- 底部 border 的长度 [v]
- 重新设计数据类型  [v]
- 写到相应的app后，如何部署在页面中 [v]

- iframe 高度[v]

2. third-lib-version-list
- 复用 自定义组件的细节展示[v]
- 修改 部分字段名称,修改弹窗的展示[v]

3. 为自定义组件添加版本说明 [v]

4. 导入工程成功,关闭当前,刷新父页面
- 打开导入之前,将当前iframe存储在导入页面 
  - 高级页面开发页面
- 关闭导入页面之前,调用存储的iframe的刷新方法
- 方案否定,跨域页面之间无法通过父容器进行通讯 [x]

- 需求更改,将当前变为父页面,实现刷新
  - 修改当前`iframe`的相应的资源链接
  - appId : 当前窗口父页面的`location`中获取 [v]
  - activeMenu : 高级页面开发页面 [v]

- 修改`sys_appinfo_index`,打开高级页面开发时,传入`appId`
- 打开导入时,直接从当前url中取 [v] 6-18 11:30

5. 文档 - 国际化整理[v]

6. 主页模板名称显示bug -- 6-14 16:30 224
- 名称由页面内部更改,手动添加会被覆盖
- 但并不由创建模板决定
- 定位到 loadPortal.action? --- vue工程 portal-designer
- portal-designer 并无问题,vue,spl两个setTitle冲突?

- 尝试 eventBus 与 setTimeout 
- setTimeout [x]
- 在组件挂载且当前的模式为view时,将当前html的文件title也进行更改[v] 6-18 15:30

------ 2019.6.18

7. 第三方js类库,及自定义组件页面bug
- 按钮悬浮tip,及其国际化 [v]
- 无可删除弹窗使用 `Nf.promptInfo`,去掉`iframe` 选项,`message`直接写`html`[v]

8. 导入工程页面标题 [v]

------ 2019-6-19

9. 查看Visual Script的数据及表现,输出文档
- 224 aw_topo

------- 2019-6-20

10. spike 数据表格的实现调研
- 实际实现时,样式不用考虑太多

------ 2019-6-25
11. 数据表格的迁移 : 不用和原来保持一致,逻辑合理即可

- 关于请求 : 自己引用外部组件实现?还是使用原来的process? [process]

- 数据类型 : record 数据在定义时有三个字段: name,type,column;但input等数据
只有两字段,datasource,有5字段
为数据添加了symbol字段验证唯一性

- 有用字段: name 数据名,type: 1,2,3,'servicecreator',columns:数据源中每一列的数据类型
- columns 只有在创建随机的表格时才会用到

- 未选中表格时,在表格上右键,触发htableAfterChange方法,旧的处理会报错,暂时return false

- 流程 : 
- 选择input/get/page,表格初始化后,存储到mockData中,更改后切换表格,当前表格
的数据存储在this.mockData中

- 获取 options : option中json [v]

- 商业激活,换handsontable7之前的版本 [handsontable@6 @handsontable/vue@3]

- **重载数据源** : 
- 当左侧的配置树更新,或者配置树或vs加载完成后,都会触发重载数据源
其目的是及时将配置中的数据源的变更更新到数据源列表中,使用vuex管理数据源后
只需要及时更新store中的数据源,即可实现数据源的响应式更新,无需手动重载
- 数据源列表`getAllMockDataType`由`vuex`管理,响应式缓存,无需手动`reload`
- 前提是vuex中的option需要及时更新
- vuex 中 state改变会影响getter吗? 
  [使用方法形式调用时,不会缓存;写在computed中,响应式缓存]

- mockDataMap : 意义不明

- 输入框的补全bug [v]

- loadData中传递的参数就是option
`loadData` : 将初始化数据加载到mockData中

-------- 2019-6-26 
12. 国际化文件的整理

-------- 2019-6-27
13. bug卡 新建widget名称校验提示 [v]

-------- 2019-6-28
14. 确认弹窗功能迁移 [v]-功能一致,样式由ui-component决定
15. 衔接

-------- 2019-7-12
16. 测试数据滚动及z-index

17. 新的数据源 添加 测试数据
- **随机数据** : 原本逻辑在判断是否存在数据表,如果不存在则进行创建
目前该功能缺失  [该逻辑加在哪,如何判断]
- **symbol区分** : 目前创建的数据源名称可重复,但重复的数据源无效
原本的数据源有效,但实际使用的同一套数据  [方案待商榷] ,[symbol的方案缺陷]

发现在optionService中已经存在了创建测试数据的函数`createMockDataColumns`,直接使用该方法
- **解决方案** : 原系统在已有列a,新增列b时,切换数据表并不能看到b,现在每次新增列都会为测试数据添加新的列,并重新创建该表格的测试数据

------- 2019-7-18
18. procode Editor url确认是否需要顶部栏[needTitleBar: true/false]

------- 2019-7-19
19. 拓扑组件添加端口(组/层中bug)

------- 2019-7-22
20. spike page-root

------- 2019-7-24
parameters 报错在 `aw_apimgt -> api-selector_card_grid` [无关]

目前定位到问题原因是`@adc/adc-ui`模块未更新,其中的`page-panel`并未将id绑定
重新安装该模块后并未改变

-------- 2019-7-25

- 更新`@adc-ui 1.2.54`, 注释其中`user-config.js@80,82`代码后,启动服务,问题解决

21. 拿到确认弹框的回调
确认后,会通过`eventBus`将数据冒泡到当前窗口的上一级`pageRoot`,因此需要将选择框也放在`pageRoot`中

-------- 2019-7-29

- 在注册事件或触发事件时,需要将对应的组件id也放入事件中,使用`single-select`可以传递`id`给对应的组件,但目前方案只能将id固定[考虑到该事件的独特性,页面中只有一个组件在使用该事件]

------- 2019-8-12

1. 关于自定义图表的`sparkline`报错问题 [解决了?]
- 原因是有在js-loader的实现中,自己引入了一个JQuery,但未在该JQuery上面挂载sparkli
e,在html页面中虽然使用`requirejs`导入了`sparkline`,但并未使用

2. 找点BUG?
  - 跑马灯
  - 自定义图表
    - 页面css不会执行,虽然脚本加入了页面,但其上加了pageKey来作为标识[css-loader.js -> addStyle]
    - js 执行正常

  - 雷达图
    - `title`的配置`left`项无效,`legend`配置有效,原编辑器也有这个问题

------- 2019-9-9
0. 组件拖拽功能 : 
  在`view-manager.js`中,定义了组件拖拽的行为:
  
  - `onDragEnter` : 拖拽进入某个组件. 拿到当前进入的组件,并将其背景色改为深蓝

  - `onDragLeave` : 离开某个组件, 对应进入,移除样式

  - `onDrop` : 落下组件到父组件中.
  -> 移除对应背景色样式, 拿到拖动组件的数据,以及父组件在pageTree中的节点,执行 `addTreeNodeCommand`命令 
  -> PageTree.vue中注册的`ADD_TREE_NODE`事件: 
  获取到需要插入的组件信息,并将其插入到对应的父组件`parentNode.insertChild()`及配置树`PageObjectStore.put()`之下

  - `allowDrop` : 
1. spl-designer 组件的嵌套
  stickyPanel 与 calendarPanel 组件 ? 

-------- 2019-9-11
- procode 高级页面开发Bug卡: 
1. 修改 : procode_advanced_page-> advanced_page_develop.css [v] padding~
2. procode_import_project -> procode_common.css  min-width:480px 
3. import_project -> js 
Nf.getYmPrompt().win -> Nf.promptError()
成功后刷新不能再使用location,studioui -> protol
使用 NfLayout.setCurrentTabUrl(url) 来跳转  [v]
4. 导入项目的失败回调中 修改 : Nf.ResourceBundle[] -> Nf.res() 其它地方? 
5.  跳转成功后顶部栏空白 [v]
6. 归档, 更新`app_dev_menu`数据库后归档
7. 所有使用`Mf.getYmPrompt()`都有问题?

-------- 2019-9-12
1. 高级页面开发js 第九行逻辑 appId ?

-------- 2019-9-24
1. apiwindow大小
2. vs编辑器国际化

-------- 2019-9-25
- 保存问题
  1. 新建脚本不会被保存
  2. 删除脚本也会保存旧的
  3. 代码转义
- 自定义组件bug :
 1. 样式 : IE textarea的bug [v]
 2. 选中状态 : click 触发两次,ie 和 chrome 中innerValue不一致  使用节流?防抖?[v]

 ------- 2019-9-27
 1. 组件属性数据: 
  - [page-object-store] `put`方法为对象添加一个`data`属性

  - `get` 从自身的 `obiMap`中通过`id`取值

  - [properties-panel] 初始化事件时 注册的点击事件,从`PageObjectStore.get(id)`获取

  - 构建行编辑器时,从`currentPageObject.data`获取 

2. 数据的`type` 应该是 `PROPERTY`, `STYLE`, `VALIDATION`,
`EVENT`,`TOOLBAR`,`ZOVERVIEW`

 ------ 


## 远程调试
- 确认 gulp 服务器配置 `/code/UIservice/.config`
- 开启 `gulp watch`
- `npm build-pro`打包文件 
- 等待watch将文件上传到 服务器
- 服务器对应位置 : `/opt/mateinfo/app` 运行态
-  `/opt/mateinfo/servercreator` 开发态

-----------

## ADCUICLI 
`使用 yeoman 来通过预先创建好的 generator 来创建本地应用`

1. 执行`npm run build`来构建全局的`procode`工具,但只是 构建好了工具的压缩包,还需要依赖`npm link` 来链接到全局:
- 执行`build/`下的`index.js`:
  - `params`获取当前进程的运行时的环境变量
  - `build` 创建暂存目录,讲需要的文件拷贝到暂存目录中, 为其中的`package.json`写入依赖信息,返回应用的名字和版本
  - `install` 在暂存目录 执行了`npm install --production`, 返回了
  - `pkg` 讲暂存文件夹中的文件打成`tar`包
  - `clear` 移除暂存文件夹

2. 使用`procode`命令行工具时,实际调用的是`/src/run.js`
- 创建一个`cli`对象,并使用其上的`router`跳转到`index`路由
  - `Cli`类使用`yeoman-environment`构建,其他命令行使用

3. 生成 :
- 生成每个工程的流程文件在渲染器的`app` 目录下`index.js`
- 定义的每个方法都会顺序的执行一遍

## 接触
1. 使用请求下载文件                                    [v]
```javaScript
let writeStream = new writeStream('han.txt');
http.get('url',(res)=>{
  res.pipe(writeStream).on('close',()=>{
    console.log('download complete');
  })
})
```
  常规发起一个对文件的请求,并打开一个写入流,使用管道将`res`
的接收流传递给写入流,当写入流关闭时,下载完成

2. 了解如何在`hmr`的`index.html`中添加内容
- 项目的配置方式

3. 关于跳转回原页面并刷新的想法 : 
- 打开新页面时,为当前页面添加`onfocus = refresh`
- refresh 中定义 取消该事件

4. 使用handsontable创建数据表格 [v]

5. 使用`Element`的组件 [v]

6. vue.extend()

7. 混入

8. slot, 布局

9. 前端模块化

-------------

## 读
1. 为cli添加css语言扩展
- 之前有css的选择,提供一个`choices`
