suite('env variables are constant', () => {
  function addSlow(a, b) {
    if (process.env.NODE_ENV === 'test') {
      // do something special
    }
  
    return a + b
  }

  const env = JSON.parse(JSON.stringify(process.env))
  function addSemiFast(a, b) {
    if (env.NODE_ENV === 'test') {
      // do something special
    }

    return a + b
  }

  // The right way to do it:
  const isTestEnv = process.env.NODE_ENV === 'test'
  function addFast(a, b) {
    if (isTestEnv) {
      // do something special
    }

    return a + b
  }

  bench('with env variable access', () => addSlow(1, 1))
  bench('with env as real object', () => addSemiFast(1, 1))
  bench('without env variable access', () => addFast(1, 1))
})
