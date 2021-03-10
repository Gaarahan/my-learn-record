class MethodDecoratorTest {
  foo(input) {
    return input * 2;
  }
}

function log(target, propertyKey, descriptor) {
  return {
    value: function (...args) {
      const a = args.map((a) => JSON.stringify(a)).join();
      const result = descriptor.value.apply(this, args);
      const r = JSON.stringify(result);
      console.log(`Call: ${propertyKey}(${a}) => ${r}`);
      return result;
    },
  };
}

/*  write your code here */
/**
 * 方法装饰器
 * declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
 */
// Tips: 方法装饰器的目的是通过对属性描述符的修改，来修改类中对应的方法

// TODO TS: 实现对应装饰函数
// TODO 怎么修改?
function __decorator() {
}

// TODO 编译器： 硬编码调用装饰函数及装饰器
// TODO 修改成什么样子? 修改什么?
__decorator();

// 目的

/*  -------------------- */

let methodDecoratorTest = new MethodDecoratorTest();
methodDecoratorTest.foo(7);
