class Student {
  userName = 'han mei mei';

  @logMethod
  setName(@log name: string) {
    this.userName = name;
  }
}

function log(target: any, key: string, index: number) {
  const metadataKey = `__log_method_${key}_params_index`;
  if (target[metadataKey]) {
    target[metadataKey].push(index);
  } else {
    target[metadataKey] = [index];
  }
}

function logMethod(target: any, key: string, desc: PropertyDescriptor) {
  const oldMethod = target[key];
  desc.value = function (...args: any[]) {
    const logKey = `__log_method_${key}_params_index`;
    const logIndexList = target[logKey];

    console.log('Start log: ')
    logIndexList.forEach(index => {
      console.log(`Param ${index} of Method ${key}: ${args[index]}`)
    })

    oldMethod.call(this, args);
  }
}

new Student().setName('li lei');

// 来自TC39:
//    Decorators should affect the thing they're decorating, and avoid confusing/non-local effects.

// 参数装饰器设计之中的灵魂:
//    参数装饰器不应该修改所属函数的任何内容

// 问题:
//    但目前参数装饰器所提供的内容足够完成修改的操作
