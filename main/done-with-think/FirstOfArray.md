### First of array

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

### Length of tuple

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

**mutable type**: 
