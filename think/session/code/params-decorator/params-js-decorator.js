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
// declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
// Tips: 方法装饰器的目的 将需要操作的参数定义在类的原型上, 结合其他装饰器读取并进行具体得操作 

// TODO TS: 实现对应装饰函数
// 参数装饰器设计之中的灵魂 :
//    参数装饰器不应该修改所属函数的任何内容, 但目前参数构造器所提供的内容足够完成修改的操作
function __decorate() {
}

// TODO 编译器： 硬编码调用装饰函数及装饰器
__decorate()

/*  -------------------- */

function __decorateForKlass(decorator, target, propertyKey) {
  const descriptorOfKeyOld = Object.getOwnPropertyDescriptor(target, propertyKey);
  const descriptorOfKey = decorator(target, propertyKey, descriptorOfKeyOld);
  Object.defineProperty(target, propertyKey, descriptorOfKey || descriptorOfKeyOld);
}
__decorateForKlass(logMethod, Student.prototype, 'setName')


new Student().setName('li lei');
