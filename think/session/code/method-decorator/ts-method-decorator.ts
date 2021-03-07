class MethodDecoratorTest {
  @logMethodTest
  foo(input: number) {
    return input * 2;
  }
}

function logMethodTest(target: object, propertyKey: string, descriptor: any) {
  return {
    value: function (...args: any[]) {
      var a = args.map((a) => JSON.stringify(a)).join();
      var result = descriptor.value.apply(this, args);
      var r = JSON.stringify(result);
      console.log(`Call: ${propertyKey}(${a}) => ${r}`);
      return result;
    },
  };
}

let methodDecoratorTest = new MethodDecoratorTest();
methodDecoratorTest.foo(7);
