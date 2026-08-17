# Christine La bella — Author Website

A single-page author website: elegant literary design, built in plain HTML/CSS/JS, ready to host free on GitHub Pages.

## Structure

```
index.html          the whole site (Home, About, Books, Stories, Blog, Contact)
css/style.css        styling
js/main.js           mobile nav + smooth scroll + active-link highlighting
downloads/            PDF / DOCX files linked from the Books and Stories sections
```

## Customizing content

Everything lives in `index.html` — open it in any text editor.

- **About**: replace the bio paragraphs in the `#about` section with Christine's real bio and photo.
- **Books**: each `.card` in `#books` is one novel. Update the title, synopsis, and the `href` in the download link to point to the real file in `downloads/`.
- **Stories**: each `.file-item` in `#stories` is one short story. Same pattern — update text and the file link.
- **Blog**: each `.blog-post` in `#blog` is one entry. Copy/paste the block to add new posts (newest at the top).
- **Contact**: update the email address and social links.

## Adding a real photo

Replace the placeholder SVG in `.about-portrait` with:
```html
<img src="images/christine.jpg" alt="Christine La bella">
```
Drop the photo file into an `images/` folder next to `css/` and `js/`.

## Adding downloadable files

1. Put the PDF or DOCX file in `downloads/`.
2. Link to it with `<a href="downloads/your-file.pdf" download>Download</a>` — the `download` attribute makes the browser save it instead of opening it.

Sample placeholder files are already included so the download buttons work out of the box:
- `downloads/the-silent-orchard-sample.pdf`
- `downloads/letters-to-no-one-sample.pdf`
- `downloads/what-the-river-kept.docx`
- `downloads/three-streetlights.pdf`

Replace these with the real files (same filenames, or update the links in `index.html`).

## Publishing to GitHub Pages

1. Create a new GitHub repository (e.g. `christine-labella-website`).
2. Upload everything in this folder to the repository root (`index.html`, `css/`, `js/`, `downloads/`).
3. On GitHub: go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to "Deploy from a branch," branch **main**, folder **/(root)**.
5. Save. GitHub gives you a live URL within a minute or two, typically:
   `https://<your-username>.github.io/christine-labella-website/`

To use a custom domain (e.g. christinelabella.com) later, add it under Settings → Pages → Custom domain — GitHub will walk you through the DNS setup.

## Notes

- No build tools or dependencies — it's plain HTML/CSS/JS, so it works as-is on GitHub Pages.
- The site is a single page with anchor navigation (`#about`, `#books`, etc.), so all links stay on one URL — simple to maintain and fast to load.
- Mobile-responsive: the nav collapses into a menu button on small screens.
