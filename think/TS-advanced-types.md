## 联合类型(|) 与 交叉类型(&)

- 联合类型可以单纯地理解为或, 类型为 `A | B` 的变量, 其最终的类型不是`A` 就是 `B`

- 交叉类型(Intersection Type)**不能理解为与**(容易跟代码的`&&`混淆) , 这里的交叉(Intersection)反而不能准确表达它的行为.这个单词是有交集的意思的,但实际上交叉类型最后的结果是这些类型的并集: 
```ts 
interface Person { color: string, age: number }
interface Han { name: string, color: string }

type t = Person & Han;

// 这里是一个简单的工具,提取出了类型t中所有的key和value
type letClear<T extends t> = {
  [K in keyof T]: T[K];
}

type as = letClear<t> 
/* 等同于 :
type as = {
    color: string;
    age: number;
    name: string;
}
*/
```

## 关于Any

### 1. `any` 退出了类型检查
- **误区 :** 在个人刚接触TS后, 对于`any`的认知就是它可以是任何类型(将`any`理解为了全集, 任意类型都是它的子集). 但现在来看,这样的认知是不准确的: 
```ts
let numberType: number = 1;
let anyType: any = numberType;
let stringType: string = anyType;
let arrayType: string[] = anyType;
```
- 这样的写法并不会报错. 即`any`类型的变量可以兼容任意类型, 同时, 任意的类型也都是兼容`any`的. 这并不符合我们所认知的父子集合之间的关系

> 引用自[TS官方文档](https://www.typescriptlang.org/docs/handbook/basic-types.html#any) 
> In some situations, not all type information is available or its declaration would take an inappropriate amount of effort. These may occur for values from code that has been written without TypeScript or a 3rd party library. In these cases, we might want to **opt-out of type checking**. To do so, we label these values with the any type...

- 这里可以看到, 使用`any`的作用是为了**选择性的避免类型检查**, 因此, 我们对于`any`做任何操作都不会使类型检查报错的原因是**此时类型检查被关闭了.**
