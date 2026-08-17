document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

siteNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll-spy: highlight active nav link
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));

/* ------------------------------------------------------------------
   Auto-loading Books & Stories from the GitHub repo's downloads/ folder
   ------------------------------------------------------------------
   Christine (or anyone) can add a new novel or story simply by
   uploading the file to downloads/books/ or downloads/stories/ in the
   GitHub repo — no HTML editing required. This script reads those
   folders live via the GitHub API and builds the page automatically.

   ONE-TIME SETUP: update the three constants below to match the real
   GitHub repository once it's created.
------------------------------------------------------------------- */

const GITHUB_OWNER = "your-github-username"; // <-- change this
const GITHUB_REPO = "christine-labella-website"; // <-- change this
const GITHUB_BRANCH = "main"; // <-- change this if using a different branch

const CACHE_MINUTES = 10; // how long to reuse a cached folder listing

const BOOK_COVER_COLORS = ["#3c3a36", "#6b5b4b", "#8a6a4b", "#544737", "#7a6a52"];

function apiUrl(folder) {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/downloads/${folder}?ref=${GITHUB_BRANCH}`;
}

// Turn "the-silent-orchard-sample.pdf" into "The Silent Orchard Sample"
function prettifyFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function fileExtension(filename) {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toUpperCase() : "FILE";
}

function formatBytes(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function colorForString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return BOOK_COVER_COLORS[Math.abs(hash) % BOOK_COVER_COLORS.length];
}

// Wrap a title into up to 3 short lines so it fits on the generated cover
function wrapTitle(title, maxCharsPerLine = 13, maxLines = 3) {
  const words = title.split(" ");
  const lines = [];
  let current = "";
  let wordsUsed = 0;

  for (const word of words) {
    if (lines.length >= maxLines) break;
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    wordsUsed++;
    if (lines.length === maxLines && current) break;
  }
  if (lines.length < maxLines && current) lines.push(current);

  if (wordsUsed < words.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/…$/, "") + "…";
  }
  return lines.slice(0, maxLines);
}

async function fetchFolder(folder) {
  const cacheKey = `gh-downloads-${GITHUB_OWNER}-${GITHUB_REPO}-${GITHUB_BRANCH}-${folder}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.time < CACHE_MINUTES * 60 * 1000) {
        return parsed.data;
      }
    } catch (e) { /* ignore bad cache */ }
  }

  const res = await fetch(apiUrl(folder), {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response shape");

  const files = data
    .filter((item) => item.type === "file" && !item.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));

  sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data: files }));
  return files;
}

function svgIcon(pathHtml, viewBox = "0 0 24 24") {
  return `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${pathHtml}</svg>`;
}

const DOWNLOAD_ICON = svgIcon('<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 19h14"/>');
const DOC_ICON = svgIcon('<path d="M7 3h7l4 4v14H7z" stroke-linejoin="round"/><path d="M14 3v4h4"/>');
const BOOK_ICON = svgIcon('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M4 10h16"/>');

function renderBooks(files, container) {
  if (files.length === 0) {
    container.innerHTML = `<p class="state-message">No books uploaded yet — add PDFs to <code>downloads/books/</code> in the GitHub repo and they'll appear here automatically.</p>`;
    return;
  }
  container.innerHTML = files
    .map((file) => {
      const title = prettifyFilename(file.name);
      const ext = fileExtension(file.name);
      const color = colorForString(file.name);
      const initials = title
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
      const titleLines = wrapTitle(title);
      const startY = 85 - (titleLines.length - 1) * 9;
      const tspans = titleLines
        .map((line, i) => `<tspan x="60" y="${startY + i * 18}">${escapeHtml(line)}</tspan>`)
        .join("");
      return `
        <article class="card">
          <div class="card-cover" aria-hidden="true">
            <svg viewBox="0 0 120 170">
              <rect width="120" height="170" fill="${color}"/>
              <rect x="0" y="0" width="6" height="170" fill="${color}" opacity="0.6"/>
              <text text-anchor="middle" fill="#f1ebe0" font-family="Georgia, serif" font-size="12">${tspans}</text>
            </svg>
            <svg class="seal" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="27" fill="#f7f2e9" stroke="#8a6a4b" stroke-width="1.5"/>
              <text x="30" y="38" text-anchor="middle" font-family="Playfair Display, serif" font-size="20" fill="#8a6a4b">${escapeHtml(initials)}</text>
            </svg>
          </div>
          <div class="card-body">
            <h3>${escapeHtml(title)}</h3>
            <p class="card-meta">${BOOK_ICON} ${ext} &middot; ${formatBytes(file.size)}</p>
            <div class="card-actions">
              <a href="${file.download_url}" class="dl-link" download>${DOWNLOAD_ICON} Download</a>
            </div>
          </div>
        </article>`;
    })
    .join("");
}

function renderStories(files, container) {
  if (files.length === 0) {
    container.innerHTML = `<p class="state-message">No stories uploaded yet — add a PDF or DOCX to <code>downloads/stories/</code> in the GitHub repo and it'll appear here automatically.</p>`;
    return;
  }
  container.innerHTML = files
    .map((file) => {
      const title = prettifyFilename(file.name);
      const ext = fileExtension(file.name);
      return `
        <li class="file-item">
          <div class="file-info">
            ${DOC_ICON.replace("<svg ", '<svg class="file-icon" ')}
            <div>
              <h3>${escapeHtml(title)}</h3>
              <p><span class="file-type">.${ext.toLowerCase()}</span> &middot; ${formatBytes(file.size)}</p>
            </div>
          </div>
          <a href="${file.download_url}" class="dl-link" download>${DOWNLOAD_ICON} Download</a>
        </li>`;
    })
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showError(container, folder) {
  container.innerHTML = `<p class="state-message">Couldn't load this list right now. This works once the site is live on GitHub Pages — if it's already live, the repo settings in <code>js/main.js</code> (GITHUB_OWNER / GITHUB_REPO) may need updating, or GitHub's API may be temporarily rate-limited. <a href="downloads/${folder}/" target="_blank" rel="noopener">Browse the folder directly instead</a>.</p>`;
}

async function loadDownloads() {
  const booksContainer = document.getElementById("booksGrid");
  const storiesContainer = document.getElementById("storiesList");

  try {
    const books = await fetchFolder("books");
    renderBooks(books, booksContainer);
  } catch (err) {
    console.warn("Could not load books:", err);
    showError(booksContainer, "books");
  }

  try {
    const stories = await fetchFolder("stories");
    renderStories(stories, storiesContainer);
  } catch (err) {
    console.warn("Could not load stories:", err);
    showError(storiesContainer, "stories");
  }
}

loadDownloads();
