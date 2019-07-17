###1. let & const
- 相对于`var`,`let`和`const`
  增加了 ： **块级**作用域
  取消了 ： 变量提升

- js一直存在作用域，但在未使用let,const时，只有函数内部是新的作用域，块级声明的变量(如if,while等块中使用var创建的变量)
从属于该块所属的函数作用域中
```js
var s = 5;
if(1){
  var s = 6;
}
console.log(s);
```

- 关于代码：
```js
  var a = [];
  for(var i = 0;i<10;i++){
    a[i] = function(){
      console.log(i);
    } 
  }
  a[6]; // => ?
```
>使用`var`来声明变量i，结果为10;使用let时，结果为6
>- 以前的错误理解：使用let时不存在闭包问题
>- 纠错 ： 闭包问题始终存在，若使用let不存在闭包问题,则函数中的输出将为未定义，而不会有结果
>- 结果为6的原因 ： 使用let声明时，变量i的作用域只为每一个循环本身，即每一个循环输出的变量i都是独立存在的，
即每一次循环的i都是一个新的变量，它被函数中的闭包保留了下来,可以理解为
a[1] : i1=1;
a[2] : i2=2;
...

2. 暂时性死区
指在某个作用域中，如果存在变量x，则在**该作用域中**，使用的任何变量x都是
该作用域中的x，即使此时的变量x还未声明
```js
var tmp = 123;
if(true){
  console.log(tmp);
  let tmp;
}
// => Uncaught ReferenceError: tmp is not defined 
```
如上，虽然在全局范围中存在变量tmp，但对于if语句的作用域:因为在该作用域中，
存在使用let声明的变量tmp，在使用console.log(tmp)时,打印的应该是该作用域中的
tmp，即后面let声明的tmp，又因为此时还未执行过声明语句，所以结果会报错为未定义

3. 块级作用域与函数声明
  在块级作用域中声明的函数，也只在该块级作用域中有效

4. const变量
const保证了**const变量存储的数据不会改动**
当const变量中存储的是简单的数据(如数字，字符串)时，数据无法做出改变
但如果存储的是数组或者对象，变量中存储的只是该对象的地址，只能保证
该地址不被改变，但该地址所指向的对象的值是可变的
```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123
```
5. 顶层变量
  在es6中
  var function 声明的全局变量，是顶层对象的属性：
  ```js
  var a = 1;
  window.a; //1
  ---- 
  function x(){}
  window.x;
  ```
  let const class 声明的全局变量，不是顶层对象的属性
  ```js
  let a = 1;
  window.a; //undefined
  ---- 
  class x{}
  window.x; //undefined
  ```
###2. 字符串的扩展
- Unicode 字符码表示
使用 `\u{xxxxx}`来表示Unicode字符码

- 字符串可以使用for...of 来遍历
```js
for(let ch of 'Gaara'){
  console.log(ch); // => G a a r a
}
```

- 为了处理双字节码使用原有的`charCodeAt()`与`charAt()`等方法获取的内容不准确的问题：
  使用`codePointAt(0)`来获取字符的Unicode字符码
  `String.fromCodePoint(\u{xxxx})` 从字符码构造出字符
  使用`at()`来返回指定位置字符,但目前似乎还未被浏览器实现
  ```js
  'a'.codePointAt(0) //=> 97
  'abc'.at(0) // => "a"
  String.fromCodePoint(97)  // => a
  ```

- 模板字符串
  模板字符串的大括号中也可以调用函数，将其返回值转化为字符串，再将其插入到字符串中
  ```js
  function han(){
    return {a:1,b:2};
  }
  `gaara ${han()}` // "gaara [Object Object]"

  functin zhao(){
    return [1,2,3,4];
  }
  `gaara ${zhao()}` //"1,2,3"
  ```
  模板字符串可以嵌套
  ```js
  let s = "zhao";
  function a(str){
    return str;
  }
  `han${
    a(
      `${s}`
     )
  }`; //同 `han${a("zhao")}` => "hanzhao"
  ```
###3. 正则扩展
- 构造正则的方式
```js
  let regex = /xyz/i;
  let regex = new RegExp('xyz','i'); // => /xyz/i
  let regex = new RegExp(/xyz/i);

  //当第二个参数为修饰符且第一个参数为带修饰符的正则表达式时，第一个参数的修饰符会被
  // 完全覆盖
  let regex = new RegExp(/xyz/gi,'i'); // => /xyz/i
```
- 粘连修饰符y
粘连修饰符y 匹配字符串中连续的模式,除第一个匹配之外，每一个匹配都必须紧跟上一个匹配才能
被匹配到,而第一个匹配必须存在于字符串的开头
```js
let r1 = /a+/g;
let r2 = /a+/y;
let r3 = /a+_/y;

let s = "aaa_aa_aaaa";

r1.exec(str); 
... //多次运行的结果为 =>  ["aaa"] , ["aa"], ["aaaa"] , null, ["aaa"] , ["aa"] ...
r2.exec(str);
...  //多次运行的结果为 =>['aaa'],null,['aaa'],null,['aaa'],null,
r3.exec(str);
...  //多次运行的结果为 => ["aaa_"],["aa_"],null ...
``` 

###4. 数值
- 进制表示
```js
let a = 0b111; // 二进制
let b = 0o10;  // 八进制
 //对应字符串转为十进制
 Number('0b111'); //7
 Number('0o10'); //8
```
- epsilon 值的引入
es6 引入了一个值，来做为一个可接受的误差范围，当浮点数的运算小于该变量的值时，我们就可以认为
运算的结果是正确的
```js
Number.EPSILON // 2.220446049250313e-16

// 检测误差的函数
function withinErrorMargin(left,right){
  return Math.abs(left-right) < Number.EPSILON;
}
```
- 安全整数的判断
es6 为整数引入两个全局变量来表示整数的范围
```js
Number.MAX_SAFE_INTEGER === Math.pow(2,53) - 1;
Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER;

//使用函数 isSafeInteger() 来判断数字是否是一个安全整数
Number.isSafeInteger('a')       //false
Number.isSafeInteger(3)         //true
Number.isSafeInteger(1.2)       //false
Number.isSafeInteger(Infinity)  //false
Number.isSafeInteger(-Infinity) //false
``` 
- Math的新方法
```js
//取整
Math.trunc(-4.9) //-4
//判断一个数是正(1)/负(-1)/0(0) 非数字返回NaN
Math.sign(-5)  // -1  
//计算立方根
Math.cbrt(8)  //2
//计算直角三角形斜边长(各个参数的平方和的平方根)
Math.hypot(3,4)   // 5
Math.hypot(3,4,5) // 7.071067811...
```

- 指数运算符,次方
```js
2 ** 2  // 4
2 ** 3  // 8

a **= 2  // a = a ** 2
a **= 3  // a = a ** 3
```

- Integer 类型的数，与原属于Number的整数类型几乎一致，但不能相互运算
在进行Integer类型的相互运算时，返回的结果也是Integer类型的整数
```js
//使用后缀n做标识
let a = 2n;
let b = 3n;
let c = 1;

a + b; // 5n
b / a; // 1n
a + c; // 报错
0n  == 0; //报错
```

###5. 函数
- 函数参数默认值是惰性求值的,在以及传入函数参数的情况下，对应的默认值表达式不会被计算
```js
let y = 1;
function func(q = ++y){
  return 0;
}
func(1);
func(1);
func(1);
console.log(y); // 多次调用后，y的值仍然为1，默认参数的表达式并未被计算

let x = 1;
function foo(p = ++x){
  console.log(p);
}
foo(); // 多次运行的结果为 2，3，4，5，6 ...
```
- 函数具有length属性来返回函数的参数个数，但引入参数默认值后，length的值就会不准确
length的值会不计算被设定默认值的参数以及其后面的所有参数
```js
(function f(x,y,z){}).length;       //  3
(function f(x,y = 0,z){}).length;   //  1
(function f(x = 0,y,z){}).length;   //  0
```
- 在设置函数默认值的函数初始化的时候，参数的声明部分会成为一个独立的作用域
```js
let a = 1;
function func(a,b = a){
  console.log(b);
}
func(2);  //  2
```
如上，函数执行结果是2，说明在进行b = a的默认参数设置时，赋值语句右边的a是该作用域中的
第一个参数，而不是全局范围内的a

- **Rest参数的写法**
```js
  function func(...args){
    for(let x of args){
      console.log(x);
    }
  }
  func(1,2,3,4,5); // 1 2 3 4 5 

  function func(a , ...args){
    for(let x of args){
      console.log(x);
    }
  }
  func(1,2,3,4,5); // 2 3 4 5 
```
- Rest 参数的本质，及使用
rest 参数是一个数组，代表了从当前位置到最后一个参数，后面不能跟其它参数,且与默认参数一样
rest参数也不被length属性所统计
```js
function func(...args){
  console.log(args);
}
func(1,2,3,4,5); // [1,2,3,4,5]

function han(a, ...args, b){}
han(1,2,3,4); //报错 : rest parameter must be last formal parameter
```
- 箭头函数
当箭头函数的返回值是对象的时候，需要使用括号将其括起来,否则会与代码块混淆
```js
  let a = ()=>{a:2,b:3}; // 错误的写法，报错
  let b = ()=>({a:2,b:3}); // 正确的写法

  let x = ()=>{a:1}; //一种错误但是可以运行的写法
  x(); //  => 返回undefined
```
对于上面的函数x，之所以可以运行，是因为js引擎在解析时，认为上面的右侧是一个代码块，
其中的`a`是后面代码`1`的标签，因此可以运行，不会报错，等同于下面这种写法
```js
  let func = ()=>{a:console.log('han')};
  func();  // => han
```

- 使用箭头函数时的注意点
1. 箭头函数中的this始终指向函数定义时的对象，而不是使用时的对象
   如下，同样的定时器中的箭头函数和传统函数的this指向不同
```js
  function foo(){
    this.a = 5;
    setTimeout(()=>{
      console.log(this); //{a:5}
    },1000);

    setTimeout(function test(){
      console.log(this); //window对象
    },1000);
  } 
  foo.call({a:10});
```
  上面的代码中，`setTimeout`中的函数中写的是同一段代码，但输出的this不同
  该函数写在定时器中,因此当该回调函数运行时，距离函数的定义已经过去了一秒，因此原始的
写法中的this指向了全局的对象window，而箭头函数仍旧指向函数定义生效时传入的对象{a:10}
  从上面代码可以看出，箭头函数的特性是：函数中的this指向函数定义时的对象(传入的对象{a:10}),
而不是函数运行时的对象(全局的windows对象)
 `箭头函数并没有自己的this指向，因此它的this指向就是外层代码块的this指向，我们可以使用
 该特性来省略在写子函数时将this也作为参数传递的麻烦过程`
  上面的结论可以很好的解释上面的过程，当箭头函数运行时，其本身并没有自己的this指向，
  因此它指向了它的外层代码块。也就是foo函数的this，使用下面的函数来检测这个结论
```js
  function foo(){
    let _this = this;
    setTimeout(
      ()=>console.log(this === _this) // true
    ,100);
  }
  foo();
```
2. 箭头函数不可以作为构造函数
3. 箭头函数中不能使用`arguments`对象，可以使用rest参数代替
`箭头函数不能使用arguments对象的原因，也是因为其没有自己的arguments对象，使用的是其外层
代码块的arguments对象`
```js
  function func(){
    setTimeout(()=>console.log(arguments)
    ,100);
  }
  func([1,2,3]); //Arguments Array(3)[1,2,3] 
```
4. 不可以使用`yield`命令，即箭头函数不能用作Generator函数

###Symbol 数据类型
- 我们可以使用`symbol`来创建一个独一无二的变量，具体实现由js引擎提供
- 对于我们来说，该值是不可见的，输出一个`symbol`变量的结果都是`Symbol()`,
不利于我们区分变量，因此，在创建该变量时，可以传入参数来描述该变量
```js
let s = Symbol(); // Symbol()
let a = Symbol(); // Symbol()
   s === a; // false
let b = Symbol('gaara'); // Symbol(gaara)
```
- 注意：Symbol不是对象，而是一种数据类型，其创建时也不需要`new`关键字
- 如果Symbol的参数是一个对象，会先调用该对象的`toString`方法，将对象转为字符串
再生成一个Symbol值
```js
let obj = [1,2,3];
let a = Symbol(obj); // Symbol(1,2,3)

obj = {
  toString(){
    return 'gaara'
  }
}
a = Symbol(obj); // Symbol(gaara)
```
- Symbol作为属性名时，虽然该属性不是私有属性，但也不能被for-in,for-of等遍历到
也不能被Object.keys(),Object.getOwnPropertyNames()获取，只能通过Object.getOwnPropertySymbol()
来获取
- 利用该特性，我们可以为对象定义一些非私有的内部方法
```js
  let obj = {
    [Symbol('func')](){
      console.log('this is func');
    },
    s : 1
  }; 
  Object.keys(obj); // ["s"]
  Object.getOwnPropertyNames(obj); // ["s"]
  Object.getOwnPropertySymbols(obj); // ["Symbol(func)"]
  Reflect.ownKeys(obj); // ["s",Symbol(func)]
  // 无法从外部调用
  let key = Reflect.ownKeys(obj)[1];
  obj.key();  // 报错
```

- 使用Symbol.for()方法可以根据描述获取Symbol值，先在全局的范围中搜索，若存在，返回该值，
若不存在以该字符串命名的Symbol变量，则会创建一个新的Symbol值
-　该方法的搜索只能搜索到以该方法创建的变量,使用Symbol()创建的值不会在全局创建用于搜索的登记
```js
let a = Symbol('han');
let b = Symbol.for('han');
let c = Symbol.for('han');
a === b // false
b === c // true
```
### CLASS 
- es6的class相当于对es5中原型链继承的重新包装，两者功能基本相同，只是class写法更相似于其他面向对象的方法，更利于理解
```js
class Person{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  toString(){
    return `(${this.x},${this.y})`;
  }
}
let a = new Person(1,2);
a.toString(); // "(1,2)"
```
- 类的原型对象上的constructor属性，指向类本身
- 类内部定义的方法是不可枚举的(non-enumerable) 与ES5不同
- 类必需使用new调用，否则会报错
- 类不存在变量提升
```js
Person.prototype.constructor === Person; // true
Object.keys(Person); // []
```
- 类的静态方法不会被实例所继承，可以直接使用类来调用
- 静态方法中的this也指向该类
- 实例属性可以直接定义在类的最顶部
```js
class Gaara{
  data = 6;  //该写法也是定义实例属性，因此不会被静态方法访问到
  constructor(name){
    this.name = name;
  }
  static han(){
    console.log(this.name +'   '+ this.data);
  }
  getAll(){
    console.log(this.name +'   '+ this.data);
  }
}
Gaara.han(); // 'Gaara  undefined'
// 相当于
Gaara.name;
Gaara.data;

Gaara.prototype.data = 6;
Gaara.han(); // 'Gaara  undefined'  类不会沿着原型向上查找

let a = new Gaara('foolish'); 
a.han();    // not a function
a.getAll(); // 'foolish 6'
```
- 静态方法可以被子类所继承,也可以从super上调用
```js
class Person extends Gaara{
  static my(){
    return super.han();
  }
}
Person.han(); // 'Person  undefined'
Person.my();  // 'Person  undefined'
```

###proxy
- proxy 可以理解为一个代理者,它可以通过定义的`get`和`set`来为原数据加一层代理,当你通过这个代理去获取或者改变这个数据时,原始的赋值取值操作并不会被执行,而proxy会接管这个操作
- proxy 中的`get set`接收两个参数,一个是操作的原始数据,另一个则是操作的属性名
```js
let obj = {a:1,b:2};
let proxy = new Proxy(obj,{
  get(target,prop){
    if(prop === 'a') return target[prop] + 2;
    return target[prop] - 2;
  },

  set(target,prop){
    console.log('no set !!!');
    return false;
  } 
});

proxy.a     // 3
proxy.b     // 0
proxy.a = 1 // no set !!!
```

###Promise
1. 特点
- promise有三个状态，pending,fulfilled,rejected.只有promise中异步操作的结果才可以
决定当前promise处于哪一个状态
- 一旦promise状态改变，就不会再进行变化(处于fulfilled或rejected)，任何时候都可以取到该状态
2. 缺点
- promise新建后就会立即执行，无法取消
- promise内部抛出的错误，在其外部只能通过回调函数来获取
- 只有一个大概的pending状态，无法具体得知promise处于哪一个状态

