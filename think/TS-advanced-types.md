## 联合类型(|) 与 交叉类型(&)

- 联合类型可以单纯的理解为或, 类型为 `A | B` 的变量, 其最终的类型不是`A` 就是 `B`

- 交叉类型(Intersection Type)**不能理解为与**(容易跟代码的`&&`混淆) , 这里的交叉(Intersection)反而不能准确表达它的行为.这个单词是有交集的意思的,但实际上交叉类型最后的结果是这些类型的并集.
```ts
interface Person { color: string, age: number }
interface Han { name: string, color: string }

type t = Person & Han;

// 
type letClear<T extends t> = {
  [K in keyof T]: T[K];
}

type as = letClear<t>
```

## 关于Any的诡异行为分析

