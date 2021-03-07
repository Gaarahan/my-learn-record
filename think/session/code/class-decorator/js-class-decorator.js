class ClassDecoratorTest {
  name = "name";
  constructor(name) {
    this.name = name;
  }
}

function rename(constructor) {
  return class extends constructor {
    name = "new name";
    constructor(...args) {
      super(args);
      console.log(this.name);
    }
  };
}

/**
 * Tips: 类装饰器
 * 
 * declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
 */

/*  write your code here */
// 实现
function __decorate(decorator, klass) {
  return decorator(klass);
}

// 调用方式
ClassDecoratorTest = __decorate(rename, ClassDecoratorTest);

// 目的

/*  -------------------- */

new ClassDecoratorTest();
