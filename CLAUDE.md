# Life Stations — CLAUDE.md

## Project overview
Full-screen tablet web app for wall-mounted daily routine stations. React + Vite, no backend, auto-deploys to Netlify from this repo. Spotify integration uses PKCE OAuth and the Web Playback SDK so the tablet itself is the audio output device.

**Live URL:** https://life-tablets.netlify.app/

## Stack
- React 18 + Vite 5
- Vanilla CSS (single `src/index.css`) — no CSS framework or component library
- No state management library — plain `useState` / `useEffect` with localStorage
- Spotify Web API + Web Playback SDK (CDN loaded at runtime)

## Key files
- `src/App.jsx` — top-level routing (home → station → routine → settings), Spotify OAuth callback
- `src/data/defaultData.js` — all default station/routine/task data and default Spotify playlist URIs
- `src/hooks/useAppState.js` — localStorage persistence + migration logic
- `src/hooks/useSpotify.js` — PKCE auth, token refresh, SDK player init, playback controls
- `src/components/HomeScreen.jsx` — clock with time-aware greeting, station grid
- `src/components/RoutineScreen.jsx` — checklist mode + single-task mode + Spotify bar
- `src/components/SettingsScreen.jsx` — task editing, playlist assignment, Spotify connect, default station

## State shape (localStorage key: `routine-tablet-v1`)
```json
{
  "stations": [...],
  "settings": {
    "viewMode": "checklist | single",
    "defaultStationId": null,
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

## Features
- **5 stations**: Bathroom, Kitchen, Desk/Living Room, Bedroom, Gym — each with an accent color
- **12 routines** with all tasks pre-loaded
- **Default station per tablet**: Settings → This Tablet → pick a station; app opens directly to it on load
- **View modes**: Checklist (all tasks at once) or one-at-a-time (focused single task)
- **Spotify**: PKCE OAuth (no backend/secret needed) + Web Playback SDK — tablet is its own audio device
- **Default playlists** pre-assigned to every routine (user can override in Settings)
- **Fully persistent**: all state in localStorage including Spotify tokens

## Spotify flow
1. User enters Client ID in Settings → clicks Connect
2. PKCE: generate verifier + challenge, store verifier in sessionStorage
3. Redirect to Spotify authorize URL
4. Spotify redirects back with `?code=`
5. `App.jsx` detects `?code=` on mount, calls `spotify.handleCallback(code)`
6. Token exchange → store tokens → `useSpotify` effect re-runs, inits Web Playback SDK
7. SDK ready → `device_id` stored in state
8. When routine starts: `playPlaylist(uri)` calls `/v1/me/player/play?device_id=...`
9. Tokens auto-refresh before expiry

## Default playlists (Spotify editorial)
| Routine | Playlist |
|---|---|
| Bathroom Morning | Morning Motivation |
| Bathroom Evening | Peaceful Piano |
| Kitchen Morning | Good Morning |
| Kitchen Evening | Chill Hits |
| Desk Morning / Focus | Deep Focus |
| Desk Pre-Call | Focus Flow |
| Desk Evening | Chill Hits |
| Bedroom Morning | Wake Up Happy |
| Bedroom Bedtime | Sleep |
| Gym Pre-Workout | Beast Mode |
| Gym Post-Workout | Cool Down & Stretch |

## Design system
- Background: `#0d0c14` (dark purple-black), Surface: `rgba(255,255,255,0.04)`
- Text: `#eeedf5`, Secondary: `#7c7a9a`, Tertiary: `#5a5878`
- Station cards use gradient backgrounds tinted with their accent color
- Station colors: Bathroom `#29B6F6`, Kitchen `#FF8C42`, Desk `#66BB6A`, Bedroom `#AB47BC`, Gym `#EF5350`
- Min touch targets: 66px height, min text 18px body, 1.7rem single-task mode
- Responsive: works on phone (≤500px) and tablet — designed for portrait wall-mount

## Dev commands
```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build to dist/
```

## Deployment
Push to `main` → Netlify auto-builds and deploys. Build command: `npm run build`, publish dir: `dist`.

## Constraints
- No backend — Spotify OAuth via PKCE only (no client secret)
- Spotify Premium required for Web Playback SDK
- Redirect URI must exactly match what's registered in Spotify Developer Dashboard
- Each tablet has independent localStorage — Spotify must be connected separately per device
