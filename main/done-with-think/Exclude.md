# Exclude

## 一个复杂但易懂, 但有些错误的解

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

4. Why OtherTest get error, but Test won't ?

    ```typescript
    type Test<T> = T extends string | number | symbol
      ? string
      : never
    type OtherTest<T extends string | number | symbol> = string

    type origin = string | number | (() => void)

    type a = Test<origin>

    // Error : Type 'origin' does not satisfy the constraint 'string | number | symbol'.
    // Type '() => void' is not assignable to type 'string | number | symbol'.
    // Type '() => void' is not assignable to type 'symbol'.(2344)
    type b = OtherTest<origin> 
    ```

## 一个看似简单的解

  ```typescript
  type MyExclude<T, U> = T extends U ? never : T
  ```
