class User {
  @logWhenChange
  userName = 'han mei mei';

  setName() {
    this.userName = 'li lei';
  }
}

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

new User().setName();