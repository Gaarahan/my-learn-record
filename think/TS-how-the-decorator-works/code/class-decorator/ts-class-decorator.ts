@rename
class ClassDecoratorTest {
  name = "name";
}

function rename<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    name = "new name";
    constructor(...args: any[]) {
      super(args);
      console.log(this.name);
    }
  };
}

new ClassDecoratorTest();
