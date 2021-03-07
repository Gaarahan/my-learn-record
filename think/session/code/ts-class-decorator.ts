@rename
class Test {
  name = 'han';
}

function rename<T extends {new (...args: any[]): {}}>(
    constructor: T
) {
  return class extends constructor {
    name = 'gaarahan';
    constructor(...args: any[]) {
      super(args)
      console.log(this.name);
    }
  }
}

new Test()