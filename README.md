# Daily Routine Tablet

A full-screen tablet web app for wall-mounted daily routine stations. Dark mode, Spotify integration with Web Playback SDK (audio plays from the tablet), and fully offline-capable with localStorage persistence.

## Features

- **5 stations**: Bathroom, Kitchen, Desk/Living Room, Bedroom, Gym
- **12 routines** across all stations
- **Checklist or one-at-a-time** task view (toggle in Settings)
- **Spotify integration**: PKCE OAuth + Web Playback SDK — the tablet itself is the audio device
- **Per-routine playlists**: assign a different playlist to each routine
- **Editable tasks**: add, edit, and delete tasks in Settings
- **Fully persistent**: all data saved in localStorage
- **No backend required**: pure static site, deploy anywhere

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Register a Spotify Developer App

1. Go to [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in any name/description
4. Set **Redirect URI** to your deployed URL, e.g.:
   - Netlify: `https://your-app.netlify.app/`
   - GitHub Pages: `https://yourusername.github.io/daily-routine-tablet/`
   - Local dev: `http://localhost:5173/`
   - **Important**: include the trailing slash
5. Under **APIs used**, check **Web Playback SDK**
6. Save. Copy your **Client ID** from the dashboard.

> **Note**: Spotify Web Playback SDK requires a **Spotify Premium** account.

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

To connect Spotify locally, add `http://localhost:5173/` as a redirect URI in your Spotify app settings.

### 4. Connect Spotify in the app

1. Tap the ⚙ settings icon on the home screen
2. Scroll to **Spotify**
3. Paste your **Client ID** and tap **Connect Spotify**
4. Authorize in the Spotify popup
5. You'll return to Settings — the tablet is now the playback device

### 5. Assign playlists to routines

1. In Settings, expand **Routines & Tasks**
2. Expand a station, then a routine
3. Paste a Spotify playlist URL (e.g. `https://open.spotify.com/playlist/...`) or URI (e.g. `spotify:playlist:...`) into the **Spotify Playlist** field
4. Now when you start that routine, the playlist auto-plays from the tablet

---

## Deploy to Netlify

### Option A — Netlify CLI

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Option B — Netlify UI (drag and drop)

1. Run `npm run build`
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**
3. Drag the `dist/` folder into the upload area

### Option C — Connect a Git repo

1. Push this repo to GitHub
2. In Netlify: **Add new site** → **Import an existing project** → connect GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Netlify auto-deploys on every push

After deploying, add your Netlify URL as a redirect URI in your Spotify app dashboard.

---

## Deploy to GitHub Pages

1. In `vite.config.js`, set `base` to your repo name: `base: '/daily-routine-tablet/'`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to package.json scripts: `"deploy": "npm run build && gh-pages -d dist"`
4. Run `npm run deploy`
5. In GitHub repo Settings → Pages, set source to `gh-pages` branch

---

## Tablet Tips

- Use your browser's **kiosk mode** or **full-screen mode** (F11) for a clean wall display
- On iPad/Android tablet, add to home screen for a native-app feel
- Pin the browser tab in full screen
- Consider a browser extension like "Kiosk" to prevent accidental navigation

---

## Architecture

```
src/
├── App.jsx                  # Routing + Spotify callback handler
├── data/defaultData.js      # Station/routine/task defaults
├── hooks/
│   ├── useAppState.js       # localStorage persistence
│   └── useSpotify.js        # Spotify PKCE + Web Playback SDK
└── components/
    ├── HomeScreen.jsx        # Station grid + clock
    ├── StationScreen.jsx     # Routine selector
    ├── RoutineScreen.jsx     # Task checklist / single-task + Spotify bar
    └── SettingsScreen.jsx    # All settings
```

All state lives in `localStorage` under the key `routine-tablet-v1`. Clearing localStorage resets to defaults.
