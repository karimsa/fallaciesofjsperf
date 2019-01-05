suite('stack frames are free', () => {
  function fRecursive(n) {
    if (n < 2) return n
    return fRecursive(n-1) + fRecursive(n-2)
  }

  function fLoop(N) {
    let c = 0
    for (let a = 1, b = 1, n = 0; n < N; n++) {
      c = a + b
      b = c
      a = b
    }
    return c
  }

  const target = 10
  bench(`fib(${target}) with recursion`, () => fRecursive(target))
  bench(`fib(${target}) with loop`, () => fLoop(target))
})
