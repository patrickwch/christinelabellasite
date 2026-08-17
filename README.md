# Christine La bella — Author Website

A single-page author website: elegant literary design, built in plain HTML/CSS/JS, ready to host free on GitHub Pages.

The **Books** and **Stories** sections load automatically from the `downloads/books` and `downloads/stories` folders in the GitHub repo — Christine can add a new novel or story just by uploading the file on GitHub. No HTML editing needed for those two sections.

## Structure

```
index.html            the whole site (Home, About, Books, Stories, Blog, Contact)
css/style.css          styling
js/main.js             mobile nav, smooth scroll, active-link highlighting, and the auto-loading logic
downloads/
  books/                upload novel PDFs here — they appear in the Books section automatically
  stories/              upload story PDFs/DOCX here — they appear in the Stories section automatically
```

## ⚠️ One-time setup (do this first)

The auto-loading feature needs to know which GitHub repo to read from. After creating the repository (see "Publishing" below):

1. Open `js/main.js`.
2. Near the top, update these three lines to match the real repo:
   ```js
   const GITHUB_OWNER = "your-github-username"; // <-- change this
   const GITHUB_REPO = "christine-labella-website"; // <-- change this
   const GITHUB_BRANCH = "main"; // <-- change this if using a different branch
   ```
3. Commit that change. The site is now wired up.

Until this is updated, the Books and Stories sections will show a "couldn't load" message.

## Adding a new book or story (the whole point)

1. Go to the repository on GitHub.
2. Open the `downloads/books` folder (for a novel) or `downloads/stories` folder (for a short story).
3. Click **Add file → Upload files**, drag in the PDF or DOCX, and commit.
4. That's it. Within a few minutes the file shows up on the live site automatically, titled from the filename.

**Filename tips**, since the title on the site is generated from the filename:
- Use hyphens instead of spaces: `the-lighthouse-keeper.pdf` becomes "The Lighthouse Keeper" on the site.
- Files are listed alphabetically by filename. To control the order (e.g. newest first), prefix filenames with a date: `2026-08-the-lighthouse-keeper.pdf`.
- Supported extensions are shown as-is (`.pdf`, `.docx`, etc.) — any file type works, but PDF and DOCX are the expected ones for readers.

To remove a book or story, just delete the file from the folder on GitHub — it disappears from the site automatically too.

## Customizing everything else

`index.html` still holds the rest of the content directly:

- **About**: replace the bio paragraphs in the `#about` section with Christine's real bio and photo.
- **Blog**: each `.blog-post` in `#blog` is one entry. Copy/paste the block to add new posts (newest at the top).
- **Contact**: update the email address and social links.
- **Footer**: update the Instagram, TikTok, and Facebook links in the `.footer-social` block to Christine's real profile URLs.

## Adding a real photo

Replace the placeholder SVG in `.about-portrait` with:
```html
<img src="images/christine.jpg" alt="Christine La bella">
```
Drop the photo file into an `images/` folder next to `css/` and `js/`.

## Publishing to GitHub Pages

1. Create a new GitHub repository (e.g. `christine-labella-website`).
2. Upload everything in this folder to the repository root (`index.html`, `css/`, `js/`, `downloads/`).
3. On GitHub: go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to "Deploy from a branch," branch **main**, folder **/(root)**.
5. Save. GitHub gives you a live URL within a minute or two, typically:
   `https://<your-username>.github.io/christine-labella-website/`
6. Don't forget the one-time setup above — update `js/main.js` with the real repo name.

To use a custom domain (e.g. christinelabella.com) later, add it under Settings → Pages → Custom domain — GitHub will walk you through the DNS setup.

## Notes on the auto-loading feature

- It works by calling GitHub's public API to list the contents of the `downloads/books` and `downloads/stories` folders, so the repository needs to stay **public** (the default for a free GitHub account) for it to work without extra setup.
- It only works when the site is actually live on the web (e.g. via GitHub Pages) — opening `index.html` directly from a folder on your computer will show a "couldn't load" message, which is expected.
- GitHub's API allows a generous but limited number of free requests per hour from any single visitor; for a personal author site this is very unlikely to ever be an issue. The site also caches the folder listing for 10 minutes per visitor to keep things fast and light.
- If something ever goes wrong with the auto-loading, each error message includes a direct link to browse the folder on GitHub as a fallback.

## Notes

- No build tools or dependencies — it's plain HTML/CSS/JS, so it works as-is on GitHub Pages.
- The site is a single page with anchor navigation (`#about`, `#books`, etc.), so all links stay on one URL — simple to maintain and fast to load.
- Mobile-responsive: the nav collapses into a menu button on small screens.
