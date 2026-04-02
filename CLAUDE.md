# Daily Routine Tablet — CLAUDE.md

## Project overview
Full-screen tablet web app for wall-mounted daily routine stations. React + Vite, no backend, deploys to Netlify or GitHub Pages. Spotify integration uses PKCE OAuth and the Web Playback SDK so the tablet itself is the audio output device.

## Stack
- React 18 + Vite 5
- Vanilla CSS (single `src/index.css`) — no CSS framework or component library
- No state management library — plain `useState` / `useEffect` with localStorage
- Spotify Web API + Web Playback SDK (CDN loaded at runtime)

## Key files
- `src/App.jsx` — top-level routing (home → station → routine → settings), Spotify OAuth callback
- `src/data/defaultData.js` — all default station/routine/task data
- `src/hooks/useAppState.js` — localStorage persistence hook
- `src/hooks/useSpotify.js` — PKCE auth, token refresh, SDK player init, playback controls
- `src/components/RoutineScreen.jsx` — checklist mode + single-task mode + Spotify bar
- `src/components/SettingsScreen.jsx` — task editing, playlist assignment, Spotify connect

## State shape (localStorage key: `routine-tablet-v1`)
```json
{
  "stations": [...],        // editable copy of defaultData
  "settings": {
    "viewMode": "checklist | single",
    "spotify": {
      "clientId": "",
      "accessToken": "",
      "refreshToken": "",
      "expiresAt": 0,
      "deviceId": null,
      "connected": false
    }
  }
}
```

## Spotify flow
1. User enters Client ID in Settings → clicks Connect
2. PKCE: generate verifier + challenge, store verifier in sessionStorage
3. Redirect to Spotify authorize URL
4. Spotify redirects back with `?code=`
5. `App.jsx` detects `?code=` on mount, calls `spotify.handleCallback(code)`
6. Token exchange → store tokens in state → `useSpotify` effect re-runs, inits Web Playback SDK
7. SDK ready → device_id stored in state
8. When routine starts: `playPlaylist(uri)` calls `/v1/me/player/play?device_id=...`

## Design system
- Background: `#080808`, Surface: `#121212`, Surface-2: `#1a1a1a`
- Text: `#f0f0f0`, Secondary: `#888`, Tertiary: `#555`
- Each station has an `--accent` CSS custom property (color)
- Station colors: Bathroom `#29B6F6`, Kitchen `#FF8C42`, Desk `#66BB6A`, Bedroom `#AB47BC`, Gym `#EF5350`
- Min touch targets: 68px height
- Min text size: 18px body, 1.15rem tasks, 1.8rem single-task mode
- Designed for portrait tablet mounted on wall

## Dev commands
```bash
npm run dev      # dev server at localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Constraints
- No backend — all Spotify OAuth via PKCE (no client secret needed)
- Spotify Premium required for Web Playback SDK
- Redirect URI must exactly match what's registered in Spotify Developer Dashboard
