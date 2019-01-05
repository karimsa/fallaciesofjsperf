# Stack frames are free.

A very useful pattern in programming is the ability to create helper functions. This is perhaps a bit overdone in JS since it is a functional programming language. One important thing to note though is that functions are a useful pattern for humans, not for machines.

Each function call generates a new stack frame and with it, a new set of scope and other resource allocations. Though the cost is small, each stack frame does indeed come with a cost. This is not such a big deal until you get to large programs that have hundreds or thousands of functions that might exist in a single stack trace. For instance, you might have a few nested helper functions across several files that cascade together to achieve one utility function and if any of those helpers rely on an external library which also follows a similar pattern, the stack trace can be rather large and will be expensive.

It is also a common pattern to have several different helper functions that get selected between depending on some sort of constant that is defined elsewhere in your code. This might be something like you enabling/disabling a log function via a constant. There are two ways that this might be implemented:

```javascript
function debug(msg) {
  if (enabled) {
    console.log(msg)
  }
}

debug('hello world')
```

Or you may choose to evaluate whether or not to print the message outside of the utility and therefore avoid one stack frame from your trace:

```javascript
function debug(msg) {
  console.log(msg)
}

if (enabled) {
  debug('hello world')
}
```

The performance difference can be radical depending on the number of debug logs that you have in critical business logic. However, a bigger benefit here is that dead-code elimination becomes very straightforward if `enabled` is a constant - you could ship a production app that does not need the debug logs at all.

In most cases, this is not really something that we can optimize for by hand (it is sometimes, but when you write code it is better to be clear rather than clever). The role of optimizing function calls should be of a compile-time optimizer such as [clojure compiler](https://developers.google.com/closure/compiler/) or [prepack](https://github.com/facebook/prepack).

```
                      stack frames are free
     101,103,164 op/s » debug enabled with inner check
     101,481,013 op/s » debug enabled with outer check
     126,364,210 op/s » debug disabled with inner check
     137,416,641 op/s » debug disabled with outer check
```

*In the first two, it is clear that there is not a significant difference between the two methods. But when debug is disabled (which is the typical production case), there can be a dramatic difference.*
