# Angular变更检测是如何工作的?

> 文章来源: [Angular University](https://blog.angular-university.io/how-does-angular-2-change-detection-really-work/)
> 译注: 该文章发表于四年前, debug部分代码已经与现在不太相同, 但原理相通.

Angular 的变更检测机制比 AngularJS 中的同等机制更加透明与易于理解.但是其中仍旧有一些我们需要了解其底层的场景(如: 在进行性能优化时).因此接下来让我们就下面几个话题来进行深入研究:

- 变更检测的实现原理
- Angular 变更检测长什么样子? 我能看到它吗?
- 默认的变更检测机制如何工作
- 打开,关闭以及手动执行变更检测
- 在 Production 与 Deveopment 模式下,避免循环变更检测
- `OnPush`变更检测模式实际上做了什么?
- 使用 Immutable.js 简化 Angular 应用的构建
- 总结

如果你需要更多关于`OnPush`变更检测的信息, 可以查看这篇博客[Angular OnPush Change Detection and Component Design - Avoid Common Pitfalls](https://blog.angular-university.io/onpush-change-detection-how-it-works)

## 变更检测的实现原理

Angular 可以检测组件的数据变化, 并自动的重绘视图以应用修改.但它是如何能在一个可能发生在页面任何位置的底层事件(例如点击按钮)发生之后做到这些的?

要理解其工作原理,我们需要认识到: JS 中, 整个运行态都是被设计成**可以重写的**. 在我们需要时,我们甚至可以重写`String`或`Number`中的方法.

### 重写浏览器的默认机制

Angular 在启动时,就会修改一些浏览器的底层API, 比如浏览器用来注册所有其所有事件(包括刚刚提到的点击事件)的`addEventListener`. Angular 会使用与这段代码等价的新版本来替换原来的`addEventListener`:

```typescript
// 新版本的addEventListener
function addEventListener(eventName, callback) {
     // 调用原始的 addEventListener
     callRealAddEventListener(eventName, function() {
        // 先调用原来的回调
        callback(...);     
        // 接着运行 Angular 特定的功能
        var changed = angular.runChangeDetection();
         if (changed) {
             angular.reRenderUIPart();
         }
     });
}
```

新版本的 addEventListener 为任何事件处理程序添加了额外的功能：不仅调用了注册的回调，而且给了 angular 机会来运行变更检测并更新 UI。

### 这种运行时的底层补丁是如何工作的?

  这些底层浏览器 API 的补丁是由 Angular 自身所装载的库 Zone.js 来完成的. 了解 zone 是什么也是很重要的.

  Zone 本质上就是一个生存在多个 Javascript 虚拟机的执行轮次(Javascript VM execution turns, 即我们常说的事件循环, 见此[问答](https://stackoverflow.com/questions/38783544/angular2-understanding-vm-turns-and-events))中的执行上下文. 是一个我们能用来为浏览器添加额外功能的通用机制. Angular 内部使用它来触发变更检测, 但它也可能有其他的使用方式, 如: 应用程序分析, 或者跨事件循坏来进行长堆栈跟踪.

### 浏览器异步API支持

下列常用的浏览器机制已经有了补丁以支持变更检测:

- 所有的浏览器事件 (click, mouseover, keyup 等)
- setTimeout() 与 setInterval()
- Ajax HTTP 请求

实际上, 还有其他许多浏览器的API被 Zone.js 打了补丁, 用来透明的触发 Angular 的变更检测, 例如 Websockets. 可以通过Zone.js的[测试用例](https://github.com/angular/angular/tree/master/packages/zone.js/test/browser)来查看目前都支持哪些API.

目前该变更检测机制的一个限制是由于一些特殊原因, 一些浏览器的异步API是不被Zone.js所支持的, 因此对应的变更检测不会触发, 例如 IndexedDB 的回调.

补丁机制解释了变更检测是如何触发的, 但触发后, 它又是如何工作的呢?

### 变更检查树

每个 Angular 组件都会关联一个在应用启动时创建的变更检测器. 比如对于下面的 TodoItem 组件:

```typescript
@Component({
    selector: 'todo-item',
    template: `<span class="todo noselect" 
       (click)="onToggle()">{{todo.owner.firstname}} - {{todo.description}}
       - completed: {{todo.completed}}</span>`
})
export class TodoItem {
    @Input()
    todo:Todo;

    @Output()
    toggle = new EventEmitter<Object>();

    onToggle() {
        this.toggle.emit(this.todo);
    }
}
```

这个组件接收一个Todo对象作为输入, 在 todo 的状态改变时 emit 出一个事件. 为了让示例更加有趣些, Todo 类包含了一个嵌套的对象:

```typescript
export class Todo {
    constructor(public id: number, 
        public description: string, 
        public completed: boolean, 
        public owner: Owner) {
    }
}
```

Todo 上有一个属性 `owner`, 是一个拥有两个属性 `firstname` 与 `lastname` 的对象.

### Todo 的变更检测是什么样的?

在运行时, 我们可以看到变更检测器是什么样的. 为此我们只需要在 Todo 类中添加一些代码来在属性被访问时[触发断点](https://github.com/jhades/blog.angular-university.io/blob/master/ng2-change-detection/src/todo.ts#L11).

当断点命中时, 我们可以通过追踪调用栈来查看变更检测:

[![40SkpF.jpg](https://z3.ax1x.com/2021/09/23/40SkpF.jpg)](https://imgtu.com/i/40SkpF)

> 译注：这里展示的代码版本较老，我们可以通过类似的方式来进行最新版本 Angular 的 debug，以查看最新版本的变更检测代码。附上一张 Angular 10 版本的截图：
> [![56HmTS.png](https://z3.ax1x.com/2021/10/22/56HmTS.png)](https://imgtu.com/i/56HmTS)
> 可以看到，NG 借助 Zone.js，在微任务队列清空后，开始进行变更检测，从根组件向子组件一路触发。

别担心, 你永远不需要debug这段代码. 这里也没有引入任何魔法, 这只是一些在应用启动时就构建好的一些简单的 Javascript 方法. 但它具体做了些什么呢?

## 默认的变更检测机制如何工作?

这个方法可能一眼看上去很奇怪, 有很多命名怪异的变量. 但深入探索后会发现它做的事情很简单: 对于每一个在模板中使用的表达式, 比较其当前值与上一个值.

如果前后不一致, 就将`isChanged`设置为 true, 仅此而已. 比较过程是通过使用一个叫`looseNotIdentical`的方法来完成的, 该方法本质上就是一个处理了`NaN`条件的特殊的`===`比较而已(代码在[这里](https://github.com/angular/angular/blob/50548fb5655bca742d1056ea91217a3b8460db08/modules/angular2/src/facade/lang.ts#L367))

### 嵌套对象`owner`又是如何工作的呢?

我们可以看到`owner`对象的属性也是会被检查的, 但只有`firstname`属性会被比较, `lastname`不会.

这是因为`lastname`并未在模板中使用. 同样的, Todo的顶级`id`属性也因为同样的原因不会被比较.

通过这个现象,我们可以断言:
> 默认情况下, Angular变更检测通过检测模板表达式的值是否改变来工作. 这对所有组件都成立.

我们也可以得出结论:
> 默认情况下, Angular 不会对对象深度比较来触发变更, 它只会比较模板用到的属性.

## 为什么默认的变更检测是这样?

Angular 的主要目标之一就是更加的透明易用, 这样框架的用户就不需要为了高效的使用而花费大量时间来 debug 框架以了解其内部机制.

如果你熟悉 AngularJs, 可以想想 `$digest()` 和 `$apply()` 以及使用或不使用它们的所有陷阱.

### 为什么不通过引用比较呢?

事实是: Javascript 对象是**易变**的, 而 Angular 想对此提供开箱即用的支持.

想象一下, 如果 Angular 默认的变更检测机制是基于引用比较的话会是什么样的? 即使像 TODO 这样简单的应用, 构建起来也会很棘手: 开发者需要非常小心的去创建一个新的Todo, 而不是简单的去更新其属性.

但正如我们将要看到的, 如果我们真的需要自定义 Angular 的变更检测机制, 也是可以的.

## 性能表现如何呢?

请注意todo list 组件的变更检测是显式引用 `todos` 属性的.

还有一种办法是动态的遍历组件的属性来进行变更检测, 这可以让代码更加通用, 而不需要对组件进行定制. 使用这种方法我们也不需要在启动时对每个组件都构建一个变更检测器. 那为什么不这样做呢?

> 译注: 上面的 debug 图中, 显式的使用了`obj.todos`这种形式来比较其`todos`属性(22行). 这就需要对每个组件构建一套特殊的变更检测函数. 而理论上可以使用这里提到的方式来做一个唯一且通用的检测函数.

### JS 虚拟机速览

这一切都与JS虚拟机的工作方式有关. 动态比较属性虽然通用, 但不容易被虚拟机JIT编译器优化成字节码.

动态比较属性不同于定制变更检测代码, 后者显式的访问了组件的每一个输入属性, 而其对应的代码非常像我们自己写出的代码, 并且是易于被虚拟机转化为字节码的.

使用生成的显式检测器的结果就是, 我们得到了一个非常快(比 AngularJs 更快), 可预测, 而且易于理解的变更检测机制.

但是如果我们有更加苛刻的性能要求, 变更检测还能再优化吗?

## `OnPush`变更检测策略

如果我们的 Todo list 应用变得非常大, 我们可以配置[TodoList](https://github.com/jhades/blog.angular-university.io/blob/master/ng2-change-detection/src/todo_list.ts)组件来使其仅在 Todo list 发生改变时更新它自己. 这点可以通过将组件的变更监测策略更新为`OnPush`来完成:

```typescript
@Component({
    selector: 'todo-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ...
})
export class TodoList {
    ...
}
```

现在让我们给应用添加一些按钮: 一个通过直接修改来切换列表的第一项, 另一个给整个列表新加了一个 Todo. 代码如下:

```typescript
@Component({
    selector: 'app',
    template: `<div>
                    <todo-list [todos]="todos"></todo-list>
               </div>
               <button (click)="toggleFirst()">Toggle First Item</button>
               <button (click)="addTodo()">Add Todo to List</button>`
})
export class App {
    todos:Array = initialData;

    constructor() {
    }

    toggleFirst() {
        this.todos[0].completed = ! this.todos[0].completed;
    }

    addTodo() {
        let newTodos = this.todos.slice(0);
        newTodos.push( new Todo(1, "TODO 4", 
            false, new Owner("John", "Doe")));
        this.todos = newTodos;
    }
}
```

我们来看看这两个新按钮的行为如何:

- 第一个按钮"Toggle First Item"不会生效. 这是因为`toggleFirst()`方法直接的修改了列表的一个元素.由于组件输入的引用并未发生改变, 因此`TodoList`不能检测到该变更.
- 第二个按钮会生效. 注意方法`addTodo()`创建了一个todo list的复制, 然后添加了一个新的todo项, 并且最后使用复制的列表替换了`todos`. 由于组件检测到了引用改变(接收到了一个新的list), 因此触发了变更检测.
- 在第二个按钮中, 如果直接去修改`todos`列表就不会生效了。想触发变更检测的话，这里的新的列表就是必须的.

### `OnPush`真的只会比较输入的引用吗?

事实不是这样的, 如果你试试通过点击来切换todo状态, 它仍旧是工作的. 甚至在你将[TodoItem](https://github.com/jhades/blog.angular-university.io/blob/master/ng2-change-detection/src/todo_item.ts)切成`OnPush`后仍能工作.这是因为`OnPush`不止检测组件输入的变化: 如果一个组件emit了事件,也会触发变更检测.

引用自 Victor Savkin 的博客:

> 在使用`OnPush`检测时, 框架会检测一个OnPush的组件情况有: 该组件的任何输入属性改变时；当组件触发一个事件时；或当一个 Observable 触发一个事件时.

虽然性能变好了, 但使用`OnPush`也会导致使用易变对象时的高复杂度. 这可能会导致出现问题时难以定位与复现, 但还是有改善的办法.

## 使用`Immutable.js`来简化 Angular 应用

如果我们只使用不可变的(immutable)对象与列表, 就可以在任何地方透明的使用`OnPush`而无需担心深陷在变更检测的 bug 中. 这是因为对于不可变对象, 唯一的修改数据的方式就是创建一个新的不可变对象来替换它. 借助不可变对象,我们可以确保:

- 一个新的不可变对象总是会触发`OnPush`变更检测.
- 不会再因为忘记为对象创建新的复制而导致 bug, 因为修改数据的唯一方式就是创建一个新对象.

使用不可变对象的一个不错的选择就是使用 [Immutable.js](https://facebook.github.io/immutable-js/) 库. 该库为构建应用提供了不可变基础, 例如不可变的对象以及不可变的列表

该库也能以类型安全的方式来应用, 可以在[这篇博客](https://blog.angular-university.io/angular-2-application-architecture-building-flux-like-apps-using-redux-and-immutable-js-js/)中找到例子.

## 避免循环变更检测: Production vs Development 模式

Angular 变更检测的一个重要属性就是: 不同于 AngularJs , 它强制执行单向数据流, 当控制器类的数据改变时, 变更检测会运行并更新视图.

但这个更新视图的行为,并**不会进一步再触发变更**（这样的变更进一步再触发视图更新便是 AngularJs 中消化循环(digest cycle)）

### Angular 中如何触发循环的变更检测?

一个办法就是使用生命周期回调. 例如在 TodoList 组件中, 我们可以触发一个回调来修改另一个组件的绑定值: 
> 译注: 这是早期的 Angular 版本, 现在在 ngAfterViewChecked 与 ngAfterViewInit 中更改绑定值时，报错信息有所不同：`ExpressionChangedAfterItHasBeenCheckedError`

```typescript
ngAfterViewChecked() {
    if (this.callback && this.clicked) {
        console.log("changing status ...");
        this.callback(Math.random());
    }
}
```

控制台中会出现如下报错:
> EXCEPTION: Expression '{{message}} in App@3:20' has changed after it was checked

这个错误只会在我们使用 development 模式运行 Angular 时抛出. production 模式又是什么表现呢?

```typescript
@NgModule({
    declarations: [App],
    imports: [BrowserModule],
    bootstrap: [App]
})
export class AppModule {}
```

在 production 模式下, error不会被抛出, 并且问题将无法被发现.

### 变更检测问题经常发生吗?

我们确实会需要触发一个变更检测循环, 但是以防万一, 最好总是在开发阶段使用 development 模式, 这样就可以避免问题的发生.

但避免问题的代价是 Angular 始终会运行两次变更检测, 第二次检测就是为了避免此场景. 但在 production 模式下, 变更检测只会运行一次.

## 打开/关掉变更检测, 并手动触发它

可能有些特殊场景下, 我们想要关掉变更检测. 想象一下: 当有大量的数据由后端服务通过 websocket 发来, 我们可能只想每5秒更新固定的部分UI. 为了做到这点, 我们可以从为组件注入变更检测器(change detector)开始:

```typescript
constructor(private ref: ChangeDetectorRef) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 5000);
  }
```

正如代码中所见, 我们**去绑定**(detach)了变更检测器, 这便有效的关掉了变更检测. 接下来我们便可简单的通过调用`detectChanges()`来手动每5秒触发.

现在让我们快速的总结一下所有关于变更检测我们需要知道的事: 是什么, 怎么工作以及变更检测支持的主要类型.

## 总结

Angular 变更检测是框架的一个内置属性, 用来保证组件数据以及HTML模板视图间的自动同步.

变更检测通过监测通用的浏览器事件来工作(例如鼠标点击, HTTP请求及其他类型的时间), 并决定是否每个组件的视图需要被更新.

有两种类型的变更检测:

- 默认变更检测: Angular 通过比较组件树中所有组件的事件发生前后的模板表达式的值来决定是否需要更新视图.
- OnPush 变更检测: 该模式通过监测是否有一些新数据被显式的推送给了组件: 要么通过组件的输入, 要么通过使用异步管道订阅的 Observable.

Angular 默认的变更检测机制实际是与 AngularJs 十分相似的: 通过在浏览器事件后比较模板表达式的值来观察是否存在变更, 对所有组件都是如此. 但相对 AngularJs 还是有一些不同:

- 首先, 不存在变更检测循环, 或在 AngularJs 中又被称为消化循环(digest cycle). 这就允许我们只需要通过查看模板及其控制器来理解每一个组件了.
- 另一个区别是, 由于构建变更检测器的方式不同, 变更检测机制要快的多.
- 最后, 不同于 AngularJs, Angular 中的变更检测机制是可以自定义的.

### 我们是否需要如此了解变更检测?

可能在95%的应用及用例中, 可以肯定的说, 变更检测正常工作并且我们不需要去了解他. 但由于以下理由, 了解它的工作机制仍旧是有用的:

- 首先, 这能帮助我们理解一些开发时的涉及变更检测的报错信息.
- 它能帮助我们阅读报错的跟踪栈, 所有的那些`zone.afterTurnDone()`突然看起来清晰多了.
- 在性能非常重要的情况下, 了解变更检测可以帮我们进行性能优化(但我们真的确定不给那些巨量数据的表格增加分页吗?).
