class MethodDecoratorTest {
  foo(input) {
    return input * 2;
  }
}

function log(target, propertyKey, descriptor) {
  return {
    value: function (...args) {
      var a = args.map((a) => JSON.stringify(a)).join();
      var result = descriptor.value.apply(this, args);
      var r = JSON.stringify(result);
      console.log(`Call: ${propertyKey}(${a}) => ${r}`);
      return result;
    },
  };
}

/*  write your code here */
// declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
// Tips: 方法装饰器的目的是通过对属性描述符的修改，来修改对应的方法

// TODO TS: 实现对应装饰函数
function __decorator(decorator, target, propertyKey) {
  const descriptorOfKeyOld = Object.getOwnPropertyDescriptor(target, propertyKey);
  const descriptorOfKey = decorator(target, propertyKey, descriptorOfKeyOld);
  Object.defineProperty(target, propertyKey, descriptorOfKey || descriptorOfKeyOld);
}

// TODO 编译器： 硬编码调用装饰函数及装饰器
__decorator(log, MethodDecoratorTest.prototype, "foo");

/*  -------------------- */

let methodDecoratorTest = new MethodDecoratorTest();
methodDecoratorTest.foo(7);
