// NOTICE: 属性装饰器并不会提供对应的属性描述符(在类实例化之前, 无法观测类上的属性)
function logWhenChange(target: any, key: string) {
  let _val = target[key];

  const setter = function(newVal: string) {
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

class User {
  @logWhenChange
  userName = 'han mei mei';
}

new User();