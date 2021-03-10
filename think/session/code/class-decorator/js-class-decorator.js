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

/*  write your code here */
/**
 * 类装饰器
 * declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
 */
// Tips: 类装饰器的目的是使用装饰器返回的新的类，替换原有的类的实现

// TODO TS: 实现对应装饰函数
// TODO 怎么修改?
function __decorate() {
}

// TODO 编译器： 硬编码调用装饰函数及装饰器
// TODO 修改成什么样子? 修改什么?
__decorate();

/*  -------------------- */

new ClassDecoratorTest();
