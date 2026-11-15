# GearWeb

Website for **Geoffrey Gear**: tenor, opera singer, voice teacher and vocal coach in Columbus, Ohio.

Live site: <https://geoffreywgear.com>

It is a static HTML site styled with [Tailwind CSS](https://tailwindcss.com) v4, hosted on GitHub Pages. There is no framework and no npm. The only build step is compiling the Tailwind CSS, and the compiled file is committed.

> **Every push to `main` deploys to the live site.** Work on a branch and merge through a pull request.

## Project structure

```
index.html            Home
about.html            About
portfolio.html        Videos and photos (carousels with lightboxes)
services.html         Service tiles, each opening an inquiry form
contact.html          Contact form
thankyou.html         Page shown after a form is sent
assets/
  css/src/site.css    Tailwind source (edit this)
  css/site.css        Compiled CSS (generated, but committed)
  js/site.js          All site JavaScript
images/               Photos, thumbnails, backgrounds
videos/               Home page hero video
sitemap.xml, robots.txt, CNAME
```

Each page is a single file that works on desktop and on phones. The layout changes with screen width:

| Width | Layout |
|---|---|
| 1024px and wider | Fixed sidebar on the left with tabs and content on the right |
| 768–1023px | The sidebar becomes a banner at the top, followed by the tabs and content |
| Under 768px | Hamburger menu and stacked content |

## Running locally on Windows with VS Code

### 1. One-time setup

1. Install [VS Code](https://code.visualstudio.com) and [Git for Windows](https://git-scm.com/download/win).
2. Clone the repo and open it in VS Code:

   ```powershell
   git clone https://github.com/GearMusicCo/GearWeb.git
   cd GearWeb
   code .
   ```

3. Install these VS Code extensions (Extensions panel, `Ctrl+Shift+X`):
   - **Live Server** (`ritwickdey.LiveServer`): serves the site locally and reloads the browser when you save.
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): autocompletes Tailwind class names. Optional, but recommended.
4. Download the Tailwind CLI. It's a single `.exe` and doesn't need Node.js. Open a terminal in VS Code (`` Ctrl+` ``) and run:

   ```powershell
   New-Item -ItemType Directory -Force tools | Out-Null
   Invoke-WebRequest https://github.com/tailwindlabs/tailwindcss/releases/download/v4.3.3/tailwindcss-windows-x64.exe -OutFile tools\tailwindcss.exe
   ```

   The `tools/` folder is gitignored, so the binary is never committed.

### 2. Start the site

**Option A: Live Server (recommended)**

Right-click `index.html` in the Explorer panel and choose **Open with Live Server**, or click **Go Live** in the status bar at the bottom right. The site opens at <http://127.0.0.1:5500> and reloads whenever you save a file.

**Option B: Python**

If Python is installed, run this from the repo root in the VS Code terminal:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000>. Stop the server with `Ctrl+C`. If `python` opens the Microsoft Store instead, Python isn't installed; use Live Server, or install Python and try `py -m http.server 8000`.

> Always view the site through a local server, not by double-clicking the `.html` files (`file:///…`). Some things don't work from `file://` URLs, such as the root-relative favicon path (`/images/...`) and YouTube embeds.

### 3. Rebuild the CSS when you change styles

Any time you add or change Tailwind classes in the HTML, or edit `assets/css/src/site.css`, rebuild `assets/css/site.css`.

While working, open a **second** terminal (`+` in the terminal panel) and leave this running. It rebuilds on every save, and Live Server then reloads the page:

```powershell
.\tools\tailwindcss.exe -i assets/css/src/site.css -o assets/css/site.css --watch
```

Before committing, run the minified build once:

```powershell
.\tools\tailwindcss.exe -i assets/css/src/site.css -o assets/css/site.css --minify
```

Commit `assets/css/site.css` along with your changes. GitHub Pages serves it as is.

### 4. Check phone layouts

In the browser, press `F12`, then `Ctrl+Shift+M` (device toolbar). Check a phone width (about 390px), a tablet width (about 900px) and full desktop.

## Making changes

- **Header, menu and footer are copied into all six pages.** If you change one of them (for example, a nav link or the footer text), make the same change in every `.html` file.
- **Styling:** use Tailwind classes in the HTML. Colors (`ink`, `panel`, `heading`, `accent`, …) and a few shared classes (`.btn`, `.panel`, `.tile`, `.section-title`, …) are defined in `assets/css/src/site.css`. Don't add inline `style=""` attributes or `<style>` blocks.
- **Portfolio:** add a video or photo by copying an existing `.media-item` block in `portfolio.html`. Video thumbnails go in `images/thumbs/` and photos in `images/media_page/`. Compress images before committing.
- **Services:** each tile's `data-*` attributes control what its inquiry form shows. They're documented at the top of the modal section in `assets/js/site.js`.
- **Forms:** both forms post to [Formspree](https://formspree.io). Keep their hidden `_next` and `subject` inputs.
- **New page or renamed page:** update `sitemap.xml` (including `lastmod`), and that page's canonical and Open Graph URLs.

More detail on the code is in [`CLAUDE.md`](CLAUDE.md).

## Deploying

Merge to `main`. GitHub Pages publishes it to <https://geoffreywgear.com>, usually within a few minutes. After changing a form, send a test inquiry on the live site and confirm it arrives and lands on the thank-you page.
