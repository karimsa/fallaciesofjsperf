# Logic should be as async as possible.

Async JS is widely adopted and has evolved quite a bit. In particular, new Node.js developers are often asked to ensure that they are not using the `*Sync` versions of the Node.js core functions that they need. An excellent writeup for understanding this better is located [here](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/).

This has often been misunderstood and misconstrued as "all logic should be as async as possible", which has led to two sub-fallacies:

## Concurreny is parallelism

I'm going to let Rob Pike handle this one: https://www.youtube.com/watch?v=PAAkCSZUG1c&t=3m42s.

TL;DR - This doesn't help performance:

```javascript
const total = await Promise.all([
  (async function() {
    let sum = 0
    for (let i = 0; i < 100; i++) {
      sum += i
    }
    return sum
  }()),
  (async function() {
    let sum = 0
    for (let i = 101; i < 200; i++) {
      sum += i
    }
    return sum
  }())
])
console.log(total[0] + total[1])
```

## Use async everywhere

With the evolution of async functions, some developers tend to over-use the `async` keyword. If your code is not using the `await` keyword, your function should not be async. It changes the signature and causes the result not to be available for an entire tick of the event loop, even if the result was already available before.

A simple example might be:

```javascript
function testA() {
  return new Promise((resolve, reject) => {
    // do stuff
  })
}

// This function does not need to be async, since it returns a promise
async function testB() {
  return testA()
}
```

This becomes a bit more complex when your function has the option to either return synchronously or asynchronously. For instance, if you have an expensive async function with a synchronous cache. From a development standpoint, it is wise to have a single return type (unless you are using TypeScript, in which case you can have a union return type without getting into headaches) - or unless you are using `async/await` everywhere, in which case you are okay to mix sync and async return types since `await` can handle both.

An example of mixed return types:

```javascript
let cache
function test() {
  if (cache) {
    return cache
  }

  return doExpensiveOp()
}

async function withAwait() {
  // this is fine, since 'await' will handle both sync and async values
  console.log(await test())
}

function withPromises() {
  // this is not okay as it will cause a runtime error when the cached
  // value is used
  return test()
    .then(() => console.log(value))
}
```

Sample benchmark: [../benchmark/async-everywhere.js](../benchmark/async-everywhere.js)
```
                      use async everywhere
      25,493,144 op/s » async function
     187,395,684 op/s » sync function
```
*Run on a MacBook Pro (Mid-2014) on Node.js v6.15.0.*
