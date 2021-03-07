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

/**
 * Tips: 方法装饰器
 * 
 * declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
 */

/*  write your code here */
// 实现
function __decorator(decorator, target, propertyKey) {
  const descriptorOfKeyOld = Object.getOwnPropertyDescriptor(
    target,
    propertyKey
  );
  const descriptorOfKey = decorator(target, propertyKey, descriptorOfKeyOld);
  Object.defineProperty(
    target,
    propertyKey,
    descriptorOfKey || descriptorOfKeyOld
  );
}

// 调用方式
__decorator(log, MethodDecoratorTest.prototype, "foo");

// 目的

/*  -------------------- */

let methodDecoratorTest = new MethodDecoratorTest();
methodDecoratorTest.foo(7);
