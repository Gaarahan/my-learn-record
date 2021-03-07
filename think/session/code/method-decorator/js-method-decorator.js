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
// Tips: 方法装饰器
function __decorator(decorator, target, propertyKey) {
  descriptorOfKeyOld = Object.getOwnPropertyDescriptor(target, propertyKey);
  descriptorOfKey = decorator(target, propertyKey, descriptorOfKeyOld);
  Object.defineProperty(target, propertyKey, descriptorOfKey);
}

__decorator(log, MethodDecoratorTest.prototype, "foo");

/*  -------------------- */

let methodDecoratorTest = new MethodDecoratorTest();
methodDecoratorTest.foo(7);
