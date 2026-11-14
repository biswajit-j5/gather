# Gather — Frontend Social Media Clone

A responsive, frontend-only social media feed concept built with **HTML, CSS, and vanilla JavaScript**. It has a polished desktop layout and a mobile-friendly view, with sample content and local interactive behavior.

## Features

- Responsive social feed layout with sidebar, stories, composer, and discovery panel
- Create text posts and attach an image from your device (maximum 5 MB)
- Like and save posts
- Search posts by text, author, handle, or circle
- Switch between feed, explore, saved posts, and messages demo views
- Latest / Following feed filters
- Follow/unfollow suggested profiles
- Share post references using clipboard when browser permissions allow
- Toast feedback and accessible modal dialogs
- Keyboard shortcut `Ctrl + K` / `⌘ + K` to focus search
- Reduced-motion support and semantic labels for core controls

## Tech stack

- HTML5
- CSS3 (responsive layout, custom properties, media queries)
- Vanilla JavaScript (no framework or build step)

## Run locally

**Option 1 — open directly**
1. Download and unzip the project.
2. Open `index.html` in a modern browser.

**Option 2 — run a local server (recommended)**
1. Open the project folder in VS Code.
2. Open a terminal in that folder.
3. Run one of the following commands:

   ```bash
   # Python 3
   python -m http.server 8001
   ```

4. Visit `http://localhost:8001` in your browser.

The workspace recommends the VS Code **Live Server** extension and configures it to serve this project on port `5500`. Open this project folder in VS Code, then right-click `index.html` and choose **Open with Live Server** (or click **Go Live** in the status bar). If the command is missing, install `ritwickdey.LiveServer` from the Extensions panel and reload VS Code. Alternatively, run the **Run Gather Live Server** task from VS Code's **Terminal → Run Task** menu; it serves at `http://localhost:8001`.

## Project structure

```text
social_media_clone/
├── index.html
├── styles.css
├── script.js
├── README.md
└── LICENSE
```

## Important limitations

This is a **frontend-only demo**, not a production social network.

- No backend, database, authentication, or real accounts
- Posts, likes, saved state, and follows are held in browser memory and reset on reload
- Messaging, comments, stories, circles, and profile editing are demo interactions
- Sample avatars and the sample landscape image are loaded from external image services; an internet connection is needed for those images
- Google Fonts are loaded from Google Fonts; fallback fonts are provided
- Clipboard sharing depends on browser support and permissions
- Image uploads are previewed locally and are not uploaded to a server

## Suggested next steps

For a full-stack version, add authentication, a REST API, persistent storage, moderation/reporting, upload storage, pagination, and security controls. For example, a Python backend could use FastAPI or Django with PostgreSQL/MySQL.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).

## Disclaimer

This project is an original educational UI demo. It is not affiliated with, endorsed by, or a copy of any specific social media company. Names, sample content, and profile images are illustrative.
