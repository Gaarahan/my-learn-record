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

3. 构造`key`所对应的类型时，直接从原来的类型中取出对应类型即可
