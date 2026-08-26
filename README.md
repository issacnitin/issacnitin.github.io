# BlogEngine

The source for [issacnitin.github.io/BlogEngine](https://issacnitin.github.io/BlogEngine/).

## Local development

Install the dependencies and start the development server:

```sh
npm ci
npm start
```

## GitHub Pages

Pushes to `master` are built and deployed by the
`Deploy to GitHub Pages` workflow. The build uses the repository path as its
public URL, and includes a `404.html` fallback so client-side routes work when
opened directly.

In the repository's **Settings > Pages** screen, set **Source** to
**GitHub Actions**.
