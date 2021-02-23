"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
      var argsLength = arguments.length, descriptorOfKey = argsLength < 3
          ? target : desc === null
              ? desc = Object.getOwnPropertyDescriptor(target, key)
              : desc, decorator;

      if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        descriptorOfKey = Reflect.decorate(decorators, target, key, desc);
      else
        for (var i = decorators.length - 1; i >= 0; i--)
          if (decorator = decorators[i])
            descriptorOfKey = (
                argsLength < 3
                    ? decorator(descriptorOfKey)
                    : (
                        argsLength > 3
                            ? decorator(target, key, descriptorOfKey)
                            : decorator(target, key)
                    )
            ) || descriptorOfKey;


      return argsLength > 3 && descriptorOfKey && Object.defineProperty(target, key, descriptorOfKey),
          descriptorOfKey;
    }
;
var __metadata = (this && this.__metadata) || function (k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
    }
;
var __param = (this && this.__param) || function (paramIndex, decorator) {
      return function (target, key) {
        decorator(target, key, paramIndex);
      }
    }
;

function required(target) {
  const descriptor = Object.getOwnPropertyDescriptor(target, 'setData');
  console.log(descriptor);
  Object.defineProperties(target, {
    'setData': {
      value: () => {
        console.log('got');
      }
    },
    'newTestFiled': {
      value: 'add filed success'
    }
  });
  console.log(target);
}

class test {
  constructor() {
    this.data = '';
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    console.log(this.data);
  }
}

__decorate([__param(0, required), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", void 0)], test.prototype, "setData", null);

a = new test();
a.setData('normal');
// a.getData();
