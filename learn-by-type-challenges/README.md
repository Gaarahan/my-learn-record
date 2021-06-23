# Learn By Type-challenges

`该仓库是个人完成[type-challenges](https://github.com/type-challenges/type-challenges)的一些记录`

`答案不全是自己的思考结果, 许多答案参考了issue的解答. 主要用于总结在做题过程中学到的类型知识`

## 实现Pick

```typescript
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

```

1. `keyof SomeType` 会拿到这个类型中所有`key`的联合， 如：

    ```typescript
    type Person = {
        name: string;
        age: number;
    }

    type t = keyof Person; // t = 'name' | 'age'
    ```

2. `extends`在泛型中，指定了**传入的第二个参数必须是存在于类型T上的key**，即必须是`keyof T`的子集(需要被T所兼容，参见[结构类型兼容](https://www.jianshu.com/p/1fe57daf908f))

3. 构造类型的`key`时，我们需要的是单个的`key`，而不是`key`的联合(`typeof T`)，因此，我们使用`[P in K]`来遍历出联合类型中所有的`key`来。

    ```typescript
    type t = {
        [T in 'person' | 'age']: T
    }
    // equals to :
    type tt = {
        person: 'person',
        age: 'age'
    }
    ```

4. 构造`key`所对应的类型时，直接从原来的类型中取出对应类型即可

## Tuple to Object

```typescript
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type TupleToObject<T> = {
    [K in T[number]]: T[K]
}


const result: TupleToObject<typeof tuple> = {} // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

- 题目在定义`tuple`时，使用了[const断言(as const)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
  const断言的作用如下：
  - 表达式中的字面量类型不会被扩展（如： 不会将`hello`推断为`string`）
  - 对象字面量中字段全部会转为只读
  - 数组字面量会变为只读的`tuple`

  对于该题目，最后的要求是将`tesla`等字符串直接提取出来，作为key和value，如果不使用const断言，我们最终提取的会是`string`，而不是具体的内容

```typescript
const withConstAssertions = ['tesla'] as const;
type a = typeof withConstAssertions; // readonly ['tesla']

const withoutConstAssertions = ['tesla'];
type b = typeof withoutConstAssertions; // string[]
```

- 主要注意的是，遍历`tuple`中的`key`时，需要将其先转化为联合类型：

```typescript
const tuple = ['han', 'zhao'] as const;

type a = typeof tuple[number];
```

## First of array

```ts
type First<T extends any[]> = T extends never[] ? never : T[0];
```

1. 在类型构造的过程中,可以使用三元表达式来进行判断.

最初的构想是判断传入的T的长度:

```ts
type First<T extends any[]> = T.length ? T[0] : never;
```

- 此处的T是类型, 我们不能点出类型上的属性，length属性需要以T["length"]的形式访问.
- 即使我们点出了length属性，也不能将其作为boolean直接在三元表达式中使用

## Length of tuple

```ts
type Length<T extends readonly any[]> = T['length']
```

1. readonly的数组, 与普通的数组是不兼容的, 即:

```ts
type x = readonly any[];
type Check<T extends any[]> = T;

// Error : The type 'x' is 'readonly' and cannot be assigned to the mutable type 'any[]'.(2344)
type res = Check<x>
```

