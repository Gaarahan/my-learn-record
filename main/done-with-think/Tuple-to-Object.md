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
