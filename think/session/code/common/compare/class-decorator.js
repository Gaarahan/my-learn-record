"use strict";

// 装饰函数：不同于我们在代码中所定义的具体的装饰器的实现
// 该函数是 ts 编译成 js 之后，执行我们所定义的装饰器的函数
// 本质上是为了应对不同装饰器调用方式不同的问题
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let ClassDecoratorTestCompare = class ClassDecoratorTestCompare {
    constructor() {
        this.name = 'name';
    }
};

// 编译器的工作：  以硬编码方式为装饰函数传参并执行
ClassDecoratorTestCompare = __decorate([
    renamed
], ClassDecoratorTestCompare);

// 装饰器的具体实现
function renamed(constructor) {
    return class extends constructor {
        constructor(...args) {
            super(args);
            this.name = 'new name';
            console.log(this.name);
        }
    };
}

new ClassDecoratorTest();
