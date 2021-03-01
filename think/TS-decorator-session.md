# 装饰器session大致架构

### 装饰器是什么

### 什么时候可以使用装饰器

### 从编译后的代码看装饰器

- 解答一个问题： 参数装饰器能干啥

- 原理

- 从编译后代码反推使用方式


### 装饰器的几个应用


------------------

# 与方小妮讨论session的几个问题

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

------------------

# 查阅资料中的疑问与解答模块

`在准备过程中有什么疑问可以写在这，说不定可以在session中用到`

- 我能借助reflection实现依赖注入吗？

- 当我使用方法装饰器修改方法时，this的指向还能生效吗？
