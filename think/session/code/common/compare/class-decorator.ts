
@rename
class ClassDecoratorTestCompare {
  name = 'name';
}

function renamed<T extends {new (...args: any[]): {}}>(
    constructor: T
) {
  return class extends constructor {
    name = 'new name';
    constructor(...args: any[]) {
      super(args)
      console.log(this.name);
    }
  }
}

new ClassDecoratorTestCompare();
