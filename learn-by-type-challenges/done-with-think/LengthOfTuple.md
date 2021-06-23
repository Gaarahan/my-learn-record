# Length of tuple

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

