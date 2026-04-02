# Devlog

## 2026-04-02 — Default playlists, visual refresh, scroll fix, phone layout

**Default Spotify playlists**
- Pre-assigned Spotify editorial playlists to every routine (Morning Motivation, Beast Mode, Deep Focus, Sleep, etc.)
- Migration logic in `useAppState`: fills empty `playlistUri` fields from defaults on load without wiping any user data or Spotify connection

**Visual redesign**
- Background changed from flat black to dark purple-black (`#0d0c14`) — less oppressive
- Station cards now have gradient backgrounds tinted with each station's accent color + colored borders
- Routine buttons have a left accent border and subtle color tint
- Progress bar and action buttons have a matching accent color glow/shadow
- Settings and inner surfaces use translucent whites instead of hardcoded greys
- Home screen now shows a time-aware greeting (Good morning / Good afternoon / Good evening)

**Scroll fix**
- Added `min-height: 0` to all flex scroll containers (settings, routines list, task content)
- Without this, flex children expand to fit content on desktop instead of scrolling

**Phone layout**
- Added `@media (max-width: 500px)` breakpoint
- Settings rows stack vertically on narrow screens
- Mode toggle and station picker buttons go full-width
- Tighter padding throughout on small screens

## 2026-04-02 — Default station per tablet

Added a **Default Station** setting. Each tablet can be configured to open directly to a specific station instead of the home screen — so the bathroom tablet always shows Bathroom, the kitchen tablet always shows Kitchen, etc.

- `settings.defaultStationId` added to state shape (persisted in localStorage)
- App initializes view/currentStationId from this setting on load
- The Home button during a routine respects the default (returns to the default station, not the full home grid)
- Back button from a station screen always goes to the full home screen, so you're never trapped
- Settings → **This Tablet** section: tap any station to set it as the default; tap **None** to restore the home screen

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
