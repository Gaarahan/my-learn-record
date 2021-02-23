### 1. 基于结构类型的兼容 -- 排序函数类型的优化

> *引用自[TS中文文档-类型兼容性](https://www.tslang.cn/docs/handbook/type-compatibility.html) :*
>
> TypeScript里的类型兼容性是基于结构子类型的。结构类型是一种只使用其成员来描述类型的方式。 它正好与名义（nominal）类型形成对比。（译者注：在基于名义类型的类型系统中，数据类型的兼容性或等价性是通过明确的声明和/或类型的名称来决定的。这与结构性类型系统不同，它是基于类型的组成结构，且不要求明确地声明。）  
- 文档中的这段话描述了一个特点： TS中，两个类型兼容，并**不需要进行显式的继承或实现。只要其结构上是兼容的即可。**


#### 1.1 背景
- 名义类型（Java， C#）,  结构性类型中，`Person`都是兼容`Student`的: 
```java
// java 
class Person {
    String name;
    int age;
}

class Student extends Person {
    String studentID;
}

Person person = new Student(); 
```

```ts
// typescript
class Person {
    name: string;
    age: number;
}

class Student extends Person {
    studentID: string;
}

const person: Person = new Student(); 
```
- 名义类型中`Teacher`与`Person`并不兼容, 因为**没有声明`Teacher extends Person`** :
```java
class Teacher {
    String name;
    int age;
    String studentID;
}
// Error :  incompatible types: Teacher cannot be converted to Person
Person person = new Teacher(); 
```
- 但在TS中，`Person`也是兼容`Teacher`的，因为**结构上，`Teacher`拥有`Person`的所有字段，且类型相同**：
```ts
class Teacher {
    name: string;
    age: number;
    studentID: string;
}
const person: Person = new Teacher();
```

#### 1.2 场景

- 这个特点在我们处理已有类型时是很有用的，如这样的场景： 我们要处理视频和图片两类资源，对如下已有的类型`Pic`和`Video`各自组成的两个列表`picList`与`videoList`进行排序，排序依据是他们的宽和高：
```ts
interface Pic {
    name: string;
    width: number;
    height: number;
    mainColor: string;
    // .... other props belong picture
}

interface Video {
    name: string;
    width: number;
    height: number;
    during: string;
    // .... other props belong video
}
```
因为他们的排序方式是相同的，所以我们实现了一个排序函数，来**对一个有宽高属性的列表进行排序**，并返回对应类型的排序后的列表，以此避免重复的排序代码：
```ts
const sortByWidthAndHeight = function (list: canBeSorted): canBeSorted {
    let sortedList = [];
    // sort by height and width
    return sortedList;
}

```

#### 1.3 问题
但此时，类型`canBeSorted`该如何定义呢？
-  **你可能会觉得，使用联合类型`PicList | VideoList`是个不错的选择:**
```ts
type canBeSorted = Pic[] | Video[];
```
的确，联合类型可以解决当前的问题， 但实际上这样的做法在一定程度上**降低了该函数的可复用性**。注意，我们设计这个函数的目的是**对一个有宽高属性的列表进行排序**，而**不是只对Pic[] 或 Video[]进行排序。**

-  **相比之下继承是一个不错的选择, 不会带来上述的问题:**
```ts
interface canBeSorted {
    width: number;
    height: number;
}

interface Pic extends canBeSorted {
    // .... 
}

interface Video extends canBeSorted {
    // .... 
}
const sortByWidthAndHeight = function (list: canBeSorted[]): canBeSorted[] {
    let sortedList = [];
    // sort by height and width
    return sortedList;
}
```
这样的修改方式在`java`这样的基于名义类型兼容的语言中是常见的，我们需要**修改之前定义好的类型**，显式的继承我们定义的基础可排序接口。

#### 1.4 类型兼容性的应用
- **结合我们这部分提到的结构性兼容，我们可以对上面的例子进行合适地改进：**
```ts
interface canBeSorted {
    width: number;
    height: number;
}

interface Pic {
    // .... 
}

interface Video {
    // .... 
}
const sortByWidthAndHeight = function (list: canBeSorted[]): canBeSorted[] {
    let sortedList = [];
    // sort by height and width
    return sortedList;
}
```
还记得开头我们提到的TS类型兼容的规则吗？在TS中，我们实际上**并不需要显式的让`Pic`和`Video`继承`canBeSorted`接口。**

因为从结构上来看，我们的**`Pic`和`Video`都是拥有`width`和`height`属性的**，因此`canBeSorted`一定是兼容我们的`Pic`和`Video`属性的。也就是说：在TS中，我们这样写出的排序函数是支持直接传入与之兼容的`Pic[]`或`Video[]`的。不需要我们对类型进行显式的继承声明。

因此，这样的修改是可以正常工作的，而且**既不会降低函数的可复用性，也不需要我们修改已有类型的定义。**

看到这里，你应该能理解TS的结构类型兼容性的概念和怎么应用了。
`注意`： 下一个小节是在理解了上述概念之后的思考，建议先搞懂上述概念。

#### 1.5 个人一点小思考（手动划重点）
`在与朋友讨论了一下是否应该显式继承之后，有了一些'这样写能否正常工作'之外的思考：`

既然`Pic`继承或者不继承`canBeSorted`都可以，那这两种写法有什么区别呢？什么时候应该继承，什么时候不应该继承呢？

我们来转化一下这两种写法下，上面的排序函数的语意： 

- `Pic`继承`canBeSorted`时，排序函数的语意： 一个对列表进行排序的工具函数，**该列表中的成员必须继承`canBeSorted`类型**。
- 不继承时，排序函数的语意： 一个对列表进行排序的工具函数，**该列表中的成员必须包含`width`和`height`属性**。

这两者虽然都解决了当前的问题，但实际上对于各个阶段的代码修改的影响是不同的：

1. 就解决目前的场景来说：
- **不使用继承所需要的修改量非常小**，很简单就能满足需求。
- 而使用继承时，我们需要**对已有的类型进行统一的修改，使之显式的继承**。

2. 当我们需要再为这个函数扩充一个场景，新增一个类型`Card`，并为同样存在宽高的`Card`列表进行排序时：
- 不使用继承时，我们需要为`Card`定义它所有的属性（包括宽高），即**将`canBeSorted`中写过的东西再写一遍**
- 而使用继承时，我们只需要**定义除了宽高之外的额外属性即可**。

```ts
// Do not use inheritance
interface Card {
  width: number;
  height: number;
  // other props ...
}

// Use inheritance
interface Card extends canBeSorted {
  // other props ...
}
```

3. 当我们需要修改这个排序函数，除了宽高，新的排序函数还需要基于这些类型共有的另一个新增字段`size`进行排序时：
- 不使用继承时，我们需要**在每个类型中都添加一次`size`属性**
- 而使用继承时，我们只需要**在`canBeSorted`中定义一次`size`属性**。

观察了这些场景，我们可以发现： 一开始使用继承时，我们虽然写了更多的代码。但随着场景不断扩充，**继承所带来的好处**会逐渐体现出来。
因此，这里得出结论： **在该工具函数不需要进行额外的场景扩充时，可以直接依靠结构类型兼容来进行快速且有效的定义。但当需要考虑可扩展性时，我们应该优先使用继承。**

#### 1.6 一点不属于兼容性讨论的小修改，可忽略：
- 到这里，我们关于类型定义的讨论就结束了。然后再为排序函数加上泛型，以添加**传入列表与传出列表类型相同**的约束，一个优雅的排序函数的类型定义就诞生了：
```ts
const sortByWidthAndHeight = function<T extends canBeSorted>(list: T[]): T[] {
    let sortedList = [];
    // sort by height and width
    return sortedList;
}

const sortedList = sortByWidthAndHeight<Pic>(picList); // good
const sortedList = sortByWidthAndHeight<Video>(videoList); // good
const sortedList = sortByWidthAndHeight<Video>(picList); // bad 
```

### 函数兼容性
- 未完待续
