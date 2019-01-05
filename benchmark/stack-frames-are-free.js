suite('stack frames are free', () => {
  let _
  function debug(msg) {
    _ = msg
  }

  function debugInner(msg, enabled) {
    if (enabled) {
      debug(msg)
    }
  }

  function debugOuter(msg) {
    debug(msg)
  }

  function runInner(enabled) {
    debugInner('hello world', enabled)
  }

  function runOuter(enabled) {
    if (enabled) {
      debugOuter('hello world')
    }
  }

  bench(`debug enabled with inner check`, () => runInner(true))
  bench(`debug enabled with outer check`, () => runOuter(true))

  bench(`debug disabled with inner check`, () => runInner(false))
  bench(`debug disabled with outer check`, () => runOuter(false))
})
