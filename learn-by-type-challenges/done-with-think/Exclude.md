# Exclude

## 1. 一个复杂但易懂, 但有些错误的解

```typescript
// 源解 https://github.com/type-challenges/type-challenges/issues/1223
type MyExclude<T, U> = T extends string | number | symbol
  ? keyof { [Key in T as Key extends U ? never : Key]: any }
  : never
```

### 1.1 工作原理拆解

1. 如何迭代联合类型以获得新类型 ?

    ```typescript
    type origin = "a" | "b" | "c";

    // T must assignable to type `string | number | symbol`
    type getIteration<T extends string | number | symbol> = {
      [key in T]: any
    }

    type result = getIteration<origin>
    ```

2. 如何过滤联合类型中的某种类型 ?

    ```typescript
    type result = {
      // use `as` to save type as variable
      // use `extends` to work as equals
      [Key in origin as Key extends "a" ? never : Key]: any;  
    }

    // 当“never”作为对象类型的键出现时发生了什么?
    type test = {
      test: string;
      [key: never]: number;
    }
    // equals to :
    type test = {
      test: string;
    }
    ```

3. 如何从对象类型中获取所有键组成的联合类型？

    ```typescript
    type origin = {
      a: string;
      b: number;
    }
    type result = keyof {  // type origin
      a: string;
      b: number;
    };  
    // equals to :
    type result1 = "a" | "b"
    ```

4. 联合类型与交叉类型与泛型与继承

    ```typescript
    type base = { x: string }

    type a = base & { y: number };
    type b = base | { y: number };

    // 直接使用类型别名
    type a1 = a extends base ? "yes" : "no";  // ”yes“
    type b1 = b extends base ? "yes" : "no";  // “no”

    type paser<T> = T extends base ? "yes" : "no";

    // 使用泛型传入类型别名
    type a2 = paser<a>;                       // ”yes“
    type b2 = paser<b>;                       // “yes” | “no”  
    ```

    1. 联合类型的写法有一定的误导效果, 使用时一定要注意, 即使联合类型里写了多个类型,但实际上它只能是这些**类型之一**.
    2. 对于联合类型整体来说,只要所联合的类型中,有一个类型不符合继承关系, 那么结果就是不符合(参见`b1`)
    3. 当使用泛型来传入类型别名时, 表现与直接使用不同, 表达式内部会将联合类型拆开, 这时返回的结果是**所有可能结果的联合**. 类型`b2`证明了这点: 类型`b`被拆解为`base`与`{y: number}`, 前者兼容,后者不兼容. 所以结果为`"yes" | "no"`.

### 1.2 存在的问题及解析

- 此解的错误之处:

  ```typescript
  type MyExclude<T, U> = T extends string | number | symbol
    ? keyof { [Key in T as Key extends U ? never : Key]: any }
    : never

  Expect<
    // 题目中的用例
    Equal<
      MyExclude<string | number | (() => void), (() => void)>,  // string | number
      Exclude<string | number | (() => void), (() => void)>     // string | number
    >
    // 会失败的用例
    Equal<
      MyExclude<string | number | (() => void), string>,  // number
      Exclude<string | number | (() => void), string>     // number | (() => void)
    >
  >
  ```

- 错误原因概述:

  此解判断了 `T extends string | number | symbol`, 若不成立,则返回`never`; 又由于`never`在联合类型中是被忽略的;所以(题目中的用例)`MyExclude`返回的`string | number | never`在判断时与`string | number`相等了, 看似实现了`Exclude`的功能.

- 原理拆解
  - **联合类型**在**使用`extends`判断**时, 位置不同, 行为也不同

      ```typescript
      type Test<T> = T extends string 
        ? number
        : symbol;

        type a = Test<string>;                                                 // 结果: number
        type b = Test<string | number>;                                        // 结果: number | symbol
        type c = Test<string | number | {/* anything... */} | (() => string)>; // 结果: number | symbol
      ```

      可以看到, 当`联合类型`用于**类型表达式内**的`extends`判断时, 是会被拆开当做单个的类型去拿到最终的结果的(联合类型的定义: 表示一个值可以是**几种类型之一**)

      而当类似的逻辑出现在泛型之中时,行为却有所不同:

      ```typescript
      type Test<T extends string> = number;

      // Error :
      //   Type 'string | number' does not satisfy the constraint 'string'.
      //   Type 'number' is not assignable to type 'string'.(2344)
      type a = Test<string | number>;
      ```

      这里的区别是: 泛型中传入的`string | number`被看做是一个具体的类型值, 这个类型`T`必须继承自`string`, 而这里是不满足的,所以会报错.

  - 联合类型中的`never`会被忽略

      ```typescript
      // type a = number;
      type a = number | never; 
      ```

## 2. 一个看似简单的解

  ```typescript
  type MyExclude<T, U> = T extends U ? never : T
  ```

  实际上此解是上面所探讨的原理的应用, 当类型T被传入后, 它会被拆解开来并单独进行判断, 当其继承自U时,返回never, 否则返回T本身. 最终的结果是这些所有结果的联合(忽略never). 可以借助以下代码理解:

  ```typescript
  const T = "T1|T2|T3|T4";
  const U = "T3";

  const MyExclude = (T, U) => {
    return T.split('|')
    .map(t => {
      // 对应逻辑 t extends U ? never : t
      if (t === U) {
        return "never";
      } else {
        return t
      }
    })
    .join('|');
  }

  const res = MyExclude(T, U);
  ```

