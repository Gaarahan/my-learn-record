class User {
  @logWhenChange
  userName = 'han mei mei';

  setName() {
    this.userName = 'li lei';
  }
}

function logWhenChange(target, key) {
  let _val = target[key];

  const setter = function(newVal) {
    console.log(`Value change: ${_val} => ${newVal}`)
    _val = newVal
  }
  const getter = function () {
    return _val;
  }
  if (delete target.userName) {
    Object.defineProperty(target, key, {
      get: getter,
      set: setter
    })
  }
}

/*  write your code here */
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;

// 实现:
function __decorate(decorator, target, key) {
  decorator(target, key)
}

// 1.

// 调用方式:
__decorate(logWhenChange, User.prototype, 'userName')
// 目的: 属性装饰器的目的 -> 修改类上的某个属性, 且保证对其所有实例都生效.

/*  -------------------- */

new User().setName();
