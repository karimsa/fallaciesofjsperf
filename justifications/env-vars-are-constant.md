# Environment variables are constant.

In Node.js, it is a very common pattern to use env variables to control certain behaviours. For instance, one may choose to enable mock versions of a given utility in a test environment:

```javascript
module.exports = function(a, b) {
  if (process.env.NODE_ENV === 'test') {
    // do something special
  }

  return a + b
}
```

There is nothing wrong with the pattern in particular except that environment variables are not constants. It is possible for you to both get and set environment variables using `process.env`. Due to this, the runtime cannot assume that the values will be unchanged and so the process will attempt to re-read its environment on every property lookup. The performance effect of this can be quite painful.

The correct way to do this is to declare constants in the scope of the module (or in a factory function if you require dynamic bootups) and then use those constants instead of calls to `process.env`. For this to work, you have to avoid setting any env vars (since they will be pre-captured) which should be fine since it is a bad practice to attempt to share memory this way across concurrent processes.

Sample benchmark: [../benchmark/env-vars-are-constant.js](../benchmark/env-vars-are-constant.js).

```
                      env variables are constant
       1,754,716 op/s » with env variable access
     100,529,489 op/s » without env variable access
```

*Run on a MacBook Pro (Mid-2014) on Node.js v6.15.0.*
