# CLAUDE.md

Marketing site for Geoffrey Gear (tenor, voice teacher, vocal coach, Columbus, Ohio). It is a static HTML site styled with Tailwind CSS v4 and served by GitHub Pages at `geoffreywgear.com` (see `CNAME`). Every push to `main` deploys. There is no package manager or test suite. The only build step is compiling the Tailwind CSS, and its output is committed.

## Running locally

Serve the repo root (for example `python -m http.server`) so root-relative paths like `/images/gg_logo.png` resolve. Check every change at desktop width (≥1024px), at the tablet band (768–1023px), and at phone width (<768px).

## Building the CSS

`assets/css/site.css` is generated. Never edit it by hand. Edit `assets/css/src/site.css` or the Tailwind classes in the HTML, then rebuild and commit both:

```
tools/tailwindcss.exe -i assets/css/src/site.css -o assets/css/site.css --minify
```

- `tools/` is gitignored. If the binary is missing, download the Tailwind v4 standalone CLI (`tailwindcss-windows-x64.exe`, currently v4.3.3) from github.com/tailwindlabs/tailwindcss/releases into `tools/tailwindcss.exe`.
- Add `--watch` while working.
- The build only sees classes written out in full in `*.html` and `assets/js/site.js` (see the `@source` lines). Classes built from string pieces in JS are dropped.

## Layout

There is one responsive page per section: `index.html`, `about.html`, `portfolio.html`, `services.html`, `contact.html`, and `thankyou.html`, the Formspree redirect target (marked `noindex`). Breakpoints are Tailwind's defaults:

| Width | Layout |
|---|---|
| `lg` and up (≥1024px) | Fixed left sidebar (`#site-header`, 30% wide) with the footer pinned to its bottom; tab bar and content on the right |
| `md`–`lg` (768–1023px) | Sidebar becomes a full-width banner with the lesson promo card, followed by the tab bar, the content and the footer |
| below `md` (<768px) | Hamburger menu. The home page shows only the full-height banner and promo card (`<main>` is hidden). Other pages hide the sidebar header and show a short photo banner (`.bg-banner`) above the content |

Above 1800px the root font size is bumped to 133% (in `@layer base`) to match the old template, so rem-based sizes scale up there.

### Shared shell, copied into every page

Each page repeats the same blocks. **When you change one, change it in all six pages.**
- **Sidebar header** (`#site-header`): `index.html` uses `flex` and the name is its `<h1>`. The other pages use `hidden … md:flex`, and the name is a `<p>` because the section title is their `<h1>`.
- **Nav** (`#site-nav`): one `<ul>` that is the tab bar at `md` and up and the hamburger dropdown below it.
  - The current page's link has `aria-current="page"`.
  - Only the home page's hamburger has `data-attention`, which triggers the shake/music-note animation.
  - The hamburger sits higher on the home page (`px-6 pt-9`) than on the others (`px-[35px] pt-[55px]`).
- **Footer** (`#site-footer`).

Nav order is Home, About, Portfolio, Services, Contact.

## Styles

- `assets/css/src/site.css` is the Tailwind source. It contains:
  - `@theme`: the palette (`ink`, `panel`, `sidebar`, `body`, `heading`, `soft`, `tile`, `field`, `line`, `accent`), fonts, and the shake / float-up animations.
  - `@layer components`: classes reused across pages: `.btn`, `.panel`, `.section-title`, `.tab`, `.field`, `.checkbox`, `.tile`, `.media-item`, `.popup-youtube` (YouTube play overlay), `.bg-notes` (sheet-music background) and `.bg-banner`.
  - Image urls there are relative to the built file (`../../images/...`).
- Everything else is Tailwind utility classes in the HTML. Don't add inline `style=""` or `<style>` blocks.
- `body` uses `line-height: 1.75em` rather than a unitless value on purpose: children inherit the computed 28px, as the old template did.
- The CSS of CDN libraries (Slick, Magnific Popup, Font Awesome) is not in a cascade layer, so it beats Tailwind utilities for any property it sets. For example, Font Awesome's `line-height: 1` on icons wins over a `leading-*` class.

## Scripts

`assets/js/site.js` holds all site JavaScript. Pages load it last. `index.html` and `portfolio.html` load jQuery 3.6.0, Magnific Popup 1.1.0 and Slick 1.8.1 from cdnjs before it. The script handles:
- **`_next` rewrite:** replaces `~` with `window.location.origin` in `input[name="_next"]`.
- **Phone menu:** toggles `data-open` on `#site-nav`, which drives the `group-data-open:` classes. Closes on an outside click or Escape.
- **Service modal** (`services.html`): each `.tile` opens `#contact-modal` and customizes it from data attributes:
  - `data-service`: text after "Thank you for considering me for your "
  - `data-tileloc`: placeholder for the location field
  - `data-removefields`: comma-separated ids. For each, `<id>-container` is hidden and its inputs disabled, so they aren't submitted.

  `.tile-header` sets the email subject (a timestamp is appended) and `.tile-subtitle` sets the modal description. Tiles also open with Enter or Space. The modal closes on ×, a backdrop click, or Escape.
- **Lightboxes:** `.popup-youtube` links open in a Magnific iframe lightbox. Photo links (`a.media-popup` inside `.media-grid`) open as an image gallery built from the real slides only, skipping Slick's cloned ones.
- **Carousels:** `.slider` (home page, 1 slide) and `.media-grid` (portfolio; 2 slides, 1 below 768px).

## Contact forms (Formspree)

Both forms (`contact.html` and the services modal) POST to `https://formspree.io/f/moeqwnre`. Keep their hidden fields when you edit them:
- `_next` = `~/thankyou.html`
- `subject`

## Assets

- `images/`: site photos. Also `overlay.png` and `bg3.jpg` (sidebar/footer background) and `gear_choir_solo.jpg` (phone banner).
- `images/thumbs/`: YouTube thumbnails.
- `images/media_page/`: gallery photos.
- `videos/maybe_hero_header.mp4`: home hero video (poster: `images/hero_poster.jpg`).

Compress media before committing (see the commit "compressed asset media"). The portfolio photos are still large and would benefit from resizing.

## SEO

Each page has its own `<title>`, meta description, canonical URL, Open Graph tags, and Twitter tags. `index.html` also has JSON-LD structured data. When you add or rename a page, also update:
- `sitemap.xml`, including its `lastmod`
- the canonical and OG URLs on that page

`robots.txt` allows everything.

## Conventions

- Indentation is tabs.
- Commit messages are short and lowercase: `feat: ...`, `fix: ...`.
