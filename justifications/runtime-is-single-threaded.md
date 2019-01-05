# The JS runtime is single-threaded.

"JS is a single-threaded language" is very widely said, but often misunderstood. Though your program itself does not have direct access to threading, the Node.js runtime & web browsers utilize multiple threads through their core APIs.

In the browser, this occurs when you use Web APIs such as XHR to make an async request. The read that makes the request will utilize a different thread than the main thread - allowing your code to execute while the request is pending.

In Node.js, there is a similar design. System calls such as to make network requests, to read/write files, etc. are "slow" which means that they cause a thread to pause execution until the request resolves. For high performance, Node.js maintains a pool of pre-allocated threads to use for syscalls. When you make requests for these resources, the request is passed onto one of the thread pools. However, you cannot execute any JS logic on those threads, only calls to external resources.

This means that although your JS code itself is single-threaded, it definitely takes advantage of a multi-threaded architecture - both in the browser and in Node.js.
