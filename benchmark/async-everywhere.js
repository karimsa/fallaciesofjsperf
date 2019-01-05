suite('use async everywhere', () => {
  async function asyncAdd(a, b) {
    return a + b
  }

  function syncAdd(a, b) {
    return a + b
  }

  bench('async function', () => asyncAdd(1, 1))
  bench('sync function', () => syncAdd(1, 1))
})
