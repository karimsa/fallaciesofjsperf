# Minification is for the front-end.

In front-end applications, it is very common to see some sort of minification tool as part of the build pipeline. It is often believed that this helps front-end applications start faster since less bandwidth is required in downloading the application. Due to this reason, it doesn't make sense for back-ends to use minified applications since reading off of a disk is fairly quick and does not provide significant performance benefits.

However, there is another big advantage to minification. Certain steps in the minification process actually optimize not just for less bytes in your program but also for faster execution time.

One of these steps is called constant folding. This is when a compiler statically analyses your program and tries to simplify parts of the code that rely on constant values.

For instance, you might have a module that conditionally exposes different functionality depending on the development configuration of the application:

```javascript
const myImplementation = 'test'

function test(a, b) {
  return a + b
}

function another(a, b) {
  return a - b
}

module.exports = myImplementation === 'test' ? test : another
```

Constant folding would change the export line to:

```javascript
module.exports = 'test' === 'test' ? test : another
```

And then a second round of constant folding might output:

```javascript
module.exports = true ? test : another
```

And finally:

```javascript
module.exports = test
```

At this point, another stage called 'dead-code elimination' can kick in and try to delete the parts of the
code which are unused. Since we no longer use the `another` function, we can get rid of it:

```javascript
function test(a, b) {
  return a + b
}
module.exports = test
```

This module will now load faster due to simpler logic and also be parsed faster due to less bytes. This specific example is too simple to fully avail the benefits of minification but there are more advanced cases in which it can make a big difference.
