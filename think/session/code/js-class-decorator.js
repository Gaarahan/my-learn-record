class Test {
  name = 'han';
  constructor(name) {
    this.name = name;
  }
}

function rename(
    constructor
) {
  return class extends constructor {
    name = 'new name';
    constructor(...args) {
      super(args)
      console.log(this.name);
    }
  }
}

/*  write your code here */
// Tips: 类装饰器

function __decorate(decorator, klass) {
  return decorator(klass);
}

Test = __decorate(rename, Test)

/*  -------------------- */

new Test('old name')
