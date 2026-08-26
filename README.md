# BlogEngine

The source for [issacnitin.github.io](https://issacnitin.github.io/).

## Local development

Install the dependencies and start the development server:

```sh
npm ci
npm start
```

## GitHub Pages

Pushes to `master` are built and deployed by the
`Deploy to GitHub Pages` workflow. Each post has a stable URL such as
`/posts/computing_power`, and the build includes a `404.html` fallback so
client-side routes work when opened directly.

In the repository's **Settings > Pages** screen, the **Source** is configured
as **GitHub Actions**.
