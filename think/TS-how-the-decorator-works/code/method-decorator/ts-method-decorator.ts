function logMethodTest(target: object, propertyKey: string, descriptor: any) {
  return {
    value: function (...args: any[]) {
      const a = args.map((a) => JSON.stringify(a)).join();
      const result = descriptor.value.apply(this, args);
      const r = JSON.stringify(result);
      console.log(`Call: ${propertyKey}(${a}) => ${r}`);
      return result;
    },
  };
}

class MethodDecoratorTest {
  @logMethodTest
  foo(input: number) {
    return input * 2;
  }
}

let methodDecoratorTest = new MethodDecoratorTest();
methodDecoratorTest.foo(7);
