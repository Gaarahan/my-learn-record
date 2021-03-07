class Student {
  userName = 'han mei mei';

  setName(name) {
    this.userName = name;
  }
}

function log(target, key, index) {
  const metadataKey = `__log_method_${key}_params_index`;
  if (target[metadataKey]) {
    target[metadataKey].add(index);
  } else {
    target[metadataKey] = new Set([index]);
  }
}

function logMethod(target, key, desc) {
  const oldMethod = target[key];
  desc.value = function (...args) {
    const logKey = `__log_method_${key}_params_index`;
    const logIndexList = target[logKey];

    console.log('Start log: ')
    logIndexList.forEach(index => {
      console.log(`Param ${index} of Method ${key}: ${args[index]}`)
    })

    oldMethod.call(this, args);
  }
}

/*  write your code here */
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;

// 实现:
// 参数装饰器设计之中的灵魂 :
//    参数装饰器不应该修改所属函数的任何内容, 但目前参数构造器所提供的内容足够完成修改的操作
function __decorate(decorator, target, key, index) {
  const oldDescriptor = Object.getOwnPropertyDescriptor(target, key);
  decorator(target, key, index)
  Object.defineProperty(target, key, oldDescriptor);
}

// 调用方式:
__decorate(log, Student.prototype, 'setName', 0)
// 目的: 参数装饰器的目的 -> 将需要操作的参数定义在类的原型上, 结合其他装饰器读取并进行具体得操作

function __decorateForKlass(decorator, target, propertyKey) {
  const descriptorOfKeyOld = Object.getOwnPropertyDescriptor(target, propertyKey);
  const descriptorOfKey = decorator(target, propertyKey, descriptorOfKeyOld);
  Object.defineProperty(target, propertyKey, descriptorOfKey || descriptorOfKeyOld);
}
__decorateForKlass(logMethod, Student.prototype, 'setName')

/*  -------------------- */

new Student().setName('li lei');
