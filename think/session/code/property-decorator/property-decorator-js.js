class User {
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
// Tips: 属性装饰器的目的: 修改类上的某个属性, 且保证对其所有实例都生效.

// TODO TS: 实现对应装饰函数
function __decorate() {
}

// TODO 编译器： 硬编码调用装饰函数及装饰器
__decorate()

/*  -------------------- */

new User().setName();
