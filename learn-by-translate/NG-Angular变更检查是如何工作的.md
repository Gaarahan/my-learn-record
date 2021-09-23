# Angular变更检测是如何工作的?

> 文章来源: [Angular University](https://blog.angular-university.io/how-does-angular-2-change-detection-really-work/)

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

  要理解其工作原理,我们需要认识到: JS 中, 整个运行态都是被设计为可以重写的. 在我们需要时,我们甚至可以重写`String`或`Number`中的方法.

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

  <-- TODO: 这里的执行轮次是什么?  -->
  Zone 本质上就是一个生存在多个 Javascript 虚拟机的执行轮次中的执行上下文. 是一个我们能用来为浏览器添加额外功能的通用机制. Angular 内部使用它来触发变更检测, 但它也可能有其他的使用方式, 如: 应用程序分析, 或者 在多个虚拟机执行轮次中进行长堆栈跟踪.

### 浏览器异步API支持

下列常用的浏览器机制已经有了补丁以支持变更检测:

- 所有的浏览器事件 (click, mouseover, keyup 等)
- setTimeout() 与 setInterval()
- Ajax HTTP 请求

实际上, 还有其他许多浏览器的API被 Zone.js 打了补丁, 用来透明的触发 Angular 的变更检测, 例如 Websockets. 可以通过Zone.js的[测试用例](https://github.com/angular/zone.js/tree/master/test/patch)来查看目前都支持哪些API.

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

别担心, 你永远不需要debug这段代码. 这里也没有引入任何魔法, 这只是一些在应用启动时就构建好的一些简单的 Javascript 方法. 但它具体做了写什么呢?

## 默认的变更检测机制如何工作

This method might look strange at first, with all the strangely named variables. But by digging deeper into it, we notice that it's doing something very simple: for each expression used in the template, it's comparing the current value of the property used in the expression with the previous value of that property.

If the property value before and after is different, it will set isChanged to true, and that's it! Well almost, it's comparing values by using a method called
looseNotIdentical(), which is really just a === comparison with special logic for the NaN case (see here).

And what about the nested object owner?
We can see in the change detector code that also the properties of the
owner nested object are being checked for differences. But only the firstname property is being compared, not the lastname property.

This is because lastname is not used in the component template ! Also, the top-level id property of Todo is not compared by the same reason.

With this, we can safely say that:

By default, Angular Change Detection works by checking if the value of template expressions have changed. This is done for all components.

We can also conclude that:

By default, Angular does not do deep object comparison to detect changes, it only takes into account properties used by the template

Why does change detection work like this by default?
One of the main goals of Angular is to be more transparent and easy to use, so that framework users don't have to go through great lengths to debug the framework and be aware of internal mechanisms in order to be able to use it effectively.

If you are familiar with AngularJs, think about $digest() and $apply() and all the pitfalls of when to use them / not to use them. One of the main goals of Angular is to avoid that.

What about comparison by reference?
The fact of the matter is that Javascript objects are mutable, and Angular wants to give full support out of the box for those.

Imagine what it would be if the Angular default change detection mechanism would be based on reference comparison of component inputs instead of the default mechanism? Even something as simple as a TODO application would be tricky to build: developers would have to be very careful to create a new Todo instead of simply updating properties.

But as we will see, it's still possible to customize Angular change detection if we really need to.

What about performance?
Notice how the change detector for the todo list component makes explicit reference to the todos property.

Another way to do this would be to loop dynamically through the properties of the component, making the code generic instead of specific to the component. This way we wouldn't have to build a change detector per component at startup time in the first place! So what's the story here?

A quick look inside the virtual machine
This all has to do with the way the Javascript virtual machine works. The code for dynamically comparing properties, although generic cannot easily be optimized away into native code by the VM just-in-time compiler.

This is unlike the specific code of the change detector, which does explicitly access each of the component input properties. This code is very much like the code we would write ourselves by hand, and is very easy to be transformed into native code by the virtual machine.

The end result of using generated but explicit detectors is a change detection mechanism that is very fast (more so than AngularJs), predictable and simple to reason about.

But if we run into a performance corner case, is there a way to optimize change detection?

The OnPush change detection mode
If our Todo list got really big, we could configure the TodoList component to update itself only when the Todo list changes. This can be done by updating the component change detection strategy to OnPush:

@Component({
    selector: 'todo-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ...
})
export class TodoList {
    ...
}
view raw04.ts hosted with ❤ by GitHub
Let's now add to out application a couple of buttons: one to toggle the first item of the list by mutating it directly, and another that adds a Todo to the whole list. The code looks like this:

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
view raw05.ts hosted with ❤ by GitHub
Lets now see how the two new buttons behave:

the first button "Toggle First Item" does not work! This is because the toggleFirst() method directly mutates an element of the list.
TodoList cannot detect this, as its input reference todos did not change
the second button does work! notice that the method addTodo() creates a copy of the todo list, and then adds an item to the copy and finally replaces the todos member variable with the copied list. This triggers change detection because the component detects a reference change in its input: it received a new list!
In the second button, mutating directly the todos list will not work! we really need a new list.
Is OnPush really just comparing inputs by reference?
This is not the case, if you try to toggle a todo by clicking on it, it still works! Even if you switch TodoItem to OnPush as well. This is because
OnPush does not check only for changes in the component inputs: if a component emits an event that will also trigger change detection.

According to this quote from Victor Savkin in his blog:

When using OnPush detectors, then the framework will check an OnPush component when any of its input properties changes, when it fires an event, or when an Observable fires an event

Although allowing for better performance, the use of OnPush comes at a high complexity cost if used with mutable objects. It might introduce bugs that are hard to reason about and reproduce. But there is a way to make the use of OnPush viable.

Using Immutable.js to simplify the building of Angular apps
If we build our application using immutable objects and immutable lists only, its possible to use OnPush everywhere transparently, without the risk of stumbling into change detection bugs. This is because with immutable objects the only way to modify data is to create a new immutable object and replace the previous object. With an immutable object, we have the guarantee that:

a new immutable object will always trigger OnPush change detection
we cannot accidentally create a bug by forgetting to create a new copy of an object because the only way to modify data is to create new objects
A good choice for going immutable is to use the Immutable.js library. This library provides immutable primitives for building applications, like for example immutable objects (Maps) and immutable lists.

This library can be also be used in a type-safe way, check this previous post for an example on how to do it.

Avoiding change detection loops: Production vs Development mode
One of the important properties of Angular change detection is that unlike AngularJs it enforces a uni-directional data flow: when the data on our controller classes gets updated, change detection runs and updates the view.

But that updating of the view does not itself trigger further changes which on their turn trigger further updates to the view, creating what in AngularJs was called a digest cycle.

How to trigger a change detection loop in Angular?
One way is if we are using lifecycle callbacks. For example in the TodoList component we can trigger a callback to another component that changes one of the bindings:

ngAfterViewChecked() {
    if (this.callback && this.clicked) {
        console.log("changing status ...");
        this.callback(Math.random());
    }
}
view raw06.ts hosted with ❤ by GitHub
An error message will show up in the console:

EXCEPTION: Expression '{{message}} in App@3:20' has changed after it was checked
This error message is only thrown if we are running Angular in development mode. What happens if we enable production mode?

@NgModule({
    declarations: [App],
    imports: [BrowserModule],
    bootstrap: [App]
})
export class AppModule {}

view raw07.ts hosted with ❤ by GitHub
In production mode, the error would not be thrown and the issue would remain undetected.

Are change detection issues frequent?
We really have to go out of our way to trigger a change detection loop, but just in case its better to always use development mode during the development phase, as that will avoid the problem.

This guarantee comes at the expense of Angular always running change detection twice, the second time for detecting this type of cases. In production mode change detection is only run once.

turning on/off change detection, and triggering it manually
There could be special occasions where we do want to turn off change detection. Imagine a situation where a lot of data arrives from the backend via a websocket. We might want to update a certain part of the UI only once every 5 seconds. To do so, we start by injecting the change detector into the component:

constructor(private ref: ChangeDetectorRef) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 5000);
  }
  
  
As we can see, we just detach the change detector, which effectively turns off change detection. Then we simply trigger it manually every 5 seconds by calling detectChanges().

Let's now quickly summarize everything that we need to know about Angular change detection: what is it, how does it work and what are the main types of change detection available.

Summary
Angular change detection is a built-in framework feature that ensures the automatic synchronization between the data of a component and its HTML template view.

Change detection works by detecting common browser events like mouse clicks, HTTP requests, and other types of events, and deciding if the view of each component needs to be updated or not.

There are two types of change detection:

default change detection: Angular decides if the view needs to be updated by comparing all the template expression values before and after the occurrence of an event, for all components of the component tree
OnPush change detection: this works by detecting if some new data has been explicitly pushed into the component, either via a component input or an Observable subscribed to using the async pipe
The Angular default change detection mechanism is actually quite similar to AngularJs: it compares the values of templates expressions before and after a browser event to see if something changed. It does so for all components. But there are also some important differences:

For one there are no change detection loops, or a digest cycle as it was named in AngularJs. This allows to reason about each component just by looking at its template and its controller.

Another difference is that the mechanism of detecting changes in a component is much faster due to the way change detectors are built.

Finally and unlike in AngularJs, the change detection mechanism is customizable.

Do we really need to know that much about change detection?
Probably for 95% of applications and use cases it's safe to say that Angular Change Detection just works and there is not much that we need to know about it. Still it's useful to have an idea on how it works, for several reasons:

for one it helps us understand some development error messages that we might come across like the one concerning change detection loops
it helps us to read error stack traces, all those zone.afterTurnDone() all of a sudden look a lot more clear
in cases where performance is at a premium (and are we sure we shouldn't just add pagination to that huge data table?), knowing about change detection helps us do performance optimizations.
If you would like to know about more advanced Angular Core features like change detection, we recommend checking the Angular Core Deep Dive course, where change detection is covered in much more detail.
