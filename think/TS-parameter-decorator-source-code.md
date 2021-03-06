## 关于TS装饰器编译后代码 - 从JS角度看TS

`对TS装饰器编译后的代码进行了简单的学习，稍作记录 2021-2`


### 基本的原理
装饰器本质上是在借助`Object.defineProperty`，对已有的类中的字段（类，方法，参数，属性）进行修改。

### 基本的编译后结构
原始代码：
```typescript
@logClass
class Test{
  @logProperty
  han: string = 'hanzhaofeng';

  @logMethod
  rename(@logParam name: string) {}
}


const han = new Test();
```

编译后的代码：
```javascript
// 装饰函数
var __decorate = /* */;
var __metadata = /* */;

// 装饰器代码
function logProperty() { /* */ }

// 被装饰的类的原始代码
class Test { /* */ }

__decorate(/* */); // 执行属性装饰器
__decorate(/* */); // 执行方法及参数装饰器
__decorate(/* */); // 执行类装饰器
```

### 从调用代码说起

#### 关于调用时机:

`TODO: 1. 整理装饰器的执行顺序，2. 参数装饰器和方法装饰器谁先执行？`

可以看到，在类声明之后，装饰器会立马被执行, 且各个装饰器之间的存在执行顺序的差别.

#### 关于调用方式

```javascript

```


### 编译后核心代码
代码来自[TS-PLAYGROUNG](https://www.typescriptlang.org/play/), TS版本`V4.1.5`, 调整了参数名称及格式化，以提升可读性
```js
/**
 * __decorate 装饰函数：不同于我们在代码中所定义的具体的装饰器的实现，该函数是 ts 编译成 js 之后，执行我们所定义的装饰器的函数
 *
 * @param {*} decorators 在某一类、方法、属性或参数上调用的所有装饰器的数组
 * @param {*} target 我们所装饰的对象其本身或其原型（视具体装饰器的类型和所装饰的对象所定,可参考引用文章, TODO 补充简易场景归类）
 * @param {*} key 所装饰属性的名称 key
 * @param {*} desc 所装饰属性的描述符 descriptor（TODO 待补充说明传参场景）
 * @return {*}
 */
// 判断装饰函数是否已经存在，未存在则声明
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    // 定义三个变量:
    // argsLength 为传入参数长度
    var argsLength = arguments.length,
      // descriptorOfKey 为当前所装饰字段的属性描述符 * 或装饰对象实例（TODO 补充）
      /**
       * 定义 descriptorOfKey, 根据传入参数不同, 以不同的方式定义
       *
       * argsLength < 3, descriptorOfKey = target;
       * argsLength >= 3, 即传入了 desc
       *    desc = null 时, descriptorOfKey = Object.getOwnPropertyDescriptor(target, key)；
       *    desc != null 时, descriptorOfKey = desc
       */
      descriptorOfKey =
        argsLength < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      // decorator 用于在后续运算中存储我们所定义的装饰器, 此处只声明
      decorator;

    // 此处判断是因为 TS 在设计时, 期待装饰器是标准函数的一部分(位于 Reflect 对象上), 但目前浏览器还不支持此方法, if 内的代码不会执行
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
      descriptorOfKey = Reflect.decorate(decorators, target, key, desc);
    } else {
      // 这里是调用装饰器的地方, 根据传入参数不同, 以不同的方式调用装饰器(分别对应不同的装饰器类型)
      /**
       * argsLength < 3 类装饰器, descriptorOfKey = decorator(descriptorOfKey);
       * argsLength > 3 方法装饰器, descriptorOfKey = decorator(target, key, descriptorOfKey);
       * argsLength = 3 属性装饰器, descriptorOfKey = decorator(target, key);
       */
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((decorator = decorators[i]))
          descriptorOfKey =
            (argsLength < 3
              ? decorator(descriptorOfKey)
              : argsLength > 3
              ? decorator(target, key, descriptorOfKey)
              : decorator(target, key)) || descriptorOfKey;
    }

    return (
      argsLength > 3 &&
        descriptorOfKey &&
        Object.defineProperty(target, key, descriptorOfKey),
      descriptorOfKey
    );
  };
```

### 装饰器工厂

`TODO： 文档中有一个很好的例子，log装饰器在不同的位置使用`

> 参考概念
> [属性描述符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
>
> [TS中的装饰器与元数据](http://blog.wolksoftware.com/decorators-reflection-javascript-typescript) : 很详细的一篇博客，但时间有点久了，编译后代码发生了一些变化
