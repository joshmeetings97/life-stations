# Devlog

## 2026-04-02 — v1.0.0 Initial build

### Created
Full project scaffolded from scratch.

**Core app**
- Vite + React 18 project, deploys to Netlify or GitHub Pages as a static site
- 5 stations: Bathroom, Kitchen, Desk/Living Room, Bedroom, Gym
- 12 routines total with all default tasks
- Two task view modes: checklist and one-at-a-time (single)
- All data persists in localStorage (`routine-tablet-v1`)
- Completion screen with accent-color glow animation on routine finish

**Spotify**
- PKCE OAuth flow (no backend / no client secret required)
- Web Playback SDK integration — tablet is its own audio output device (Spotify Premium required)
- Per-routine playlist assignment (accepts Spotify URL or URI format)
- Auto-plays assigned playlist when routine starts
- Mini Spotify bar shown during routines: album art, track name, artist, prev/pause/next controls
- Token auto-refresh on expiry

**Settings screen**
- Toggle between checklist and one-at-a-time view
- Spotify connect / disconnect
- Per-station, per-routine task editor (add, edit, delete tasks)
- Playlist URI/URL input per routine

**Design**
- Dark mode (#080808 background) with per-station accent colors
- Large touch targets (min 68px), large text — designed for wall-mounted portrait tablet
- CSS animations on screen transitions and completion
- No external CSS framework or icon library (inline SVGs only)
