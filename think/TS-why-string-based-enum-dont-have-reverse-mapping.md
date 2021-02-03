### 为什么字符串枚举没有反向映射?

> 参考自该[ISSUE](https://github.com/Microsoft/TypeScript/issues/21935):
> 
> If we provided the reverse map automatically (which, by the way, is not necessarily non-ambiguous!), then you'd have no way to distinguish keys from values unless there was a completely separate object created at runtime. It is trivial to write a function that constructs the reverse map if you want it; our goal is to emit as little code as possible, so it makes sense to just emit the data you need (to keep code size down) and let you construct the reverse map on an as-needed basis.

- 总结一下 : 字符串枚举如果还使用[数字枚举的映射方式](#数字枚举如何实现映射)来做反向映射. 会出现[key和value混淆](#关于key和value混淆)的情况. 同时考虑到实现一个反向映射的函数的成本不高, 设计上便建议"不统一处理, 而是在需要的时候自己去实现一个(此时你需要自己确保key, value不会混淆)"

#### 数字枚举如何实现映射

观察一下数字枚举的编译结果,可以看到数字型枚举为何能反向映射 :
```typescript
// 数字型枚举
enum NUMBER {
    ONE = 1,
    TWO = 2
}
// 编译结果
var NUMBER;
(function (NUMBER) {
    NUMBER[NUMBER["ONE"] = 1] = "ONE";
    NUMBER[NUMBER["TWO"] = 2] = "TWO";
})(NUMBER || (NUMBER = {}));
// 最终构造出来的枚举对象 : 
NUMBER = {
    1: "ONE",
    2: "TWO",
    ONE: 1,
    TWO: 2
}
```
可以看到, 数字类型枚举最终构造出了一个同名的对象, 在这个对象上同时有使用枚举的key和value做成的字段. 

#### 关于key和value混淆

数字型枚举的key和value分别是字符串与数字, 因此不会出现冲突. 而字符串枚举的key与value都是字符串, 如果要以上面的方式实现反向映射, 则很容易混淆 : 
```ts
enum STRING_ENUM {
    ONE = 'TWO',
    TWO = 'THREE'
}
// 以数字型枚举的方式映射 : 
STRING_ENUM = {
    ONE: "TWO",
    THREE: "TWO",
    TWO: "" // "ONE" or "THREE" ?
}
```
