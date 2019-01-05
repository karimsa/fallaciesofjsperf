# Bundling is for the front-end.

This fallacy is quite similar to "Minification is for the front-end." (and depends on its justification as a prerequisite).

Bundling with tools like webpack and browserify can often be found in the build pipeline of front-end applications. One important use case for this has been the ability to use a module system on the front-end. Another important use case for this was to lower the number of requests that need to be made to a static file server in order to render a given page. Both of these cases are relevant to front-end applications and will not affect back-end applications.

For back-end applications, the most common use case of bundling advocated for is the ability to use a module system in serverless platforms where only a single function may be exported onto the platform. This is pretty self-explanatory since it is quite similar to the use of modularization on the front-end.

There is another use case for back-end which is very important and is growing in popularity over the last few years. That is the ability for an optimization compiler to be able to optimize dynamic code across modules.

For instance, let's look at an example similar to the one for minification:

`index.js`:
```javascript
import factory from './helper'

const test = factory('test')
console.log(test(1, 1))
```

`helper.js`:
```javascript
function test(a, b) {
  return a + b
}

function another(a, b) {
  return a - b
}

export default function (impl) {
  return impl === 'test' ? test : another
}
```

This example is almost exactly the same as the other one in terms of functionality, but with a sublte difference in terms of how it is written. This is pretty common to have in your production code - where the dynamic code is selected based on constants which are variable within the helper module but their use is actually constnat.

By bundling these together (let's use rollup for the example), we would get:

```javascript
function test(a, b) {
  return a + b
}

function another(a, b) {
  return a - b
}

function factory (impl) {
  return impl === 'test' ? test : another
}

const test$1 = factory('test');
console.log(test$1(1, 1));
```

Which can then be constant folded all the way down to:

```javascript
console.log(2)
```

Again, this particular example may not seem particularly useful, but a larger production app has many opportunities for optimizations.
