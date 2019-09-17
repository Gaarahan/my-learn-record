#### Vue.use() 做了什么?
`源码位于 /github/vue/src/core/global-api/use.js`

```js
import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```
**为Vue实例挂载一个Vue.use方法** :
- toArray 方法的作用是将一个类数组对象转化为数组
- 首先拿到已经安装的插件列表,查找是否已经安装了该插件,如果安装了,就不再进行安装,直接返回,否则进行插件的安装
- 因为`Vue.use`可以传多个参数,第一个参数为插件的名称,后面的参数为对该插件的传参,在实际注册插件的时候,需要将传入的参数截取出来,并传递到插件的安装函数中去
- Vue.use 实际上做的是将一个插件放到安装列表中去,并防止多次安装,在安装插件时,它将Vue的实例传递给了安装函数,实际的安装过程交给了插件本身

this is for local-test