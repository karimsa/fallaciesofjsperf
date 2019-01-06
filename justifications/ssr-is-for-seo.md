# SSR is only for SEO.

Server-Side Renderng (SSR) is the design pattern of pre-rendering a part or all of a webpage on the server rather than on the client. For instance, for a todo application, your server might pre-render and send the following html:

```html
...
  <link rel="stylesheet" href="css/index.css">
...
  <ul>
    <li>Item #1</li>
    <li>Item #2</li>
  </ul>
...
```

Meanwhile the same functionality could be done using client-side rendering in which you would ship an empty page with a library like React. After rendering a blank page, your JS would then fetch the list data from the back-end and re-render the page with a list on it. Something like this:

```html
<div id="app"></div>
<script>
  async function render() {
    let html = '<ul>'
    for (const item of await fetch('/api/todo').json()) {
      html += `<li>${item}</li>`
    }
    return html + '</ul>'
  }

  const app = document.querySelector('#app')
  render().then(html => app.innerHTML = ul)
</script>
```

One popular use case for this is for Search Engine Optimization (SEO). The problem with shipping a blank application to clients is that when a search engine scrapes your application to index it, there will be no content for it to index. However, if you render the content on the server-side, the search engine can grab the content simply by sending a simple HTTP request.

However, SEO is not the only use case for SSR. One big push for SSR is the ability to help clients get to initial app render faster - which is the minimal content needed for the application to be usable. One of the big reasons that this helps is because it simplifies your critical rendering path - mostly by removing the unnecessary JS execution for first render. Your JS will still be loaded for dynamic page changes but if it is not a necessity for first load, the overall performance of your application could be better (there are trade-offs ofcourse).

### Real world case

In a real world production case, Walmart Labs did experiments on using SSR vs. CSR strictly for performance and user experience for various components of their product & they noticed user engangment rates improve with the SSR version ([Source](https://medium.com/walmartlabs/the-benefits-of-server-side-rendering-over-client-side-rendering-5d07ff2cefe8)).
