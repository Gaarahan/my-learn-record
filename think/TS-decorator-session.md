# 装饰器session大致架构

### 装饰器是什么

### 什么时候可以使用装饰器

### 从编译后的代码看装饰器

- 解答一个问题： 参数装饰器能干啥

- 原理

- 从编译后代码反推使用方式


### 装饰器的几个应用


------------------

# session的几个问题

1. page5： 装饰器统一打印异步结果
```typescript
function logResult(
  target: Object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
) {
  const originMethod = propertyDescriptor.value;
  
  const newMethod = function(...args: any[]) {
    return originMethod.apply(this, args) 
      .then(() => {
        console.log('success');
      }, () => {
        console.log('failed');
      })
  }

  propertyDescriptor.value = newMethod;

  return propertyDescriptor;
}

class User {
  count = 0;

  @logResult
  setName() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.count++;
        if (this.count%3 === 0) {
          resolve('');
        } else {
          reject();
        }
      }, 0);
    })
  }
}


const user = new User();
for(let i = 0; i < 6; i++) {
  console.log(user.setName());
}
```

2. page 14: 装饰器的执行时机
`TODO: 这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数`

3. 方法装饰器修饰静态成员时，target为类本身
编译后调用方式便不同，静态成员调用装饰器时传入的是类本身

```javascript
class Test {
    constructor() {
        this.property = '';
    }
}
Test.staticProperty = '';

__decorate([
    log,
    __metadata("design:type", Object)
], Test.prototype, "property", void 0);

__decorate([
    log,
    __metadata("design:type", Object)
], Test, "staticProperty", void 0);
```

4. 访问器装饰器有什么特殊的？

- 访问装饰器装饰于类中的get与set属性
- 访问装饰器不能同时用于同一个属性的get和set: 
本质上是因为同名的get和set最终会变为对象上的一个属性，他们的属性描述符只有一个。若允许同时定义装饰器，则需要涉及两个装饰器修改的冲突问题
```javascript
class Test {
    a = 'hhh';
    get han() {
        return this.a;
    }
    set han(val) {
        this.a = val;
    }
}
let x = new Test();
// 等同于：
x = {
  a: 'hhh', // 位于实例上
  han: 'hhh' // 位于原型上
}
```

5. page 23: 装饰器不能用于函数？

`TODO: ts中不存在该问题，后续有兴趣再补充`

------------------

# 查阅资料中的疑问与解答模块

`在准备过程中有什么疑问可以写在这，说不定可以在session中用到`

- 我能借助reflection实现依赖注入吗？

- 当我使用方法装饰器修改方法时，this的指向还能生效吗？
