import { useState } from 'react'

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return <h2 className="settings-section-header">{children}</h2>
}

function Toggle({ value, onChange, labelOff, labelOn }) {
  return (
    <button
      className={`toggle-btn${value ? ' toggle-btn--on' : ''}`}
      onClick={() => onChange(!value)}
    >
      <span className="toggle-btn__track">
        <span className="toggle-btn__thumb" />
      </span>
      <span className="toggle-btn__label">{value ? labelOn : labelOff}</span>
    </button>
  )
}

// ─── Routine editor ───────────────────────────────────────────────────────────

function RoutineEditor({ station, routine, onUpdateRoutine }) {
  const [open, setOpen] = useState(false)
  const [newTask, setNewTask] = useState('')

  const handleTaskBlur = (taskId, value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    onUpdateRoutine(station.id, routine.id, {
      tasks: routine.tasks.map((t) => (t.id === taskId ? { ...t, text: trimmed } : t)),
    })
  }

  const handleDeleteTask = (taskId) => {
    onUpdateRoutine(station.id, routine.id, {
      tasks: routine.tasks.filter((t) => t.id !== taskId),
    })
  }

  const handleAddTask = () => {
    const text = newTask.trim()
    if (!text) return
    onUpdateRoutine(station.id, routine.id, {
      tasks: [
        ...routine.tasks,
        { id: `custom-${Date.now()}`, text },
      ],
    })
    setNewTask('')
  }

  const handlePlaylistChange = (value) => {
    onUpdateRoutine(station.id, routine.id, { playlistUri: value })
  }

  return (
    <div className="routine-editor">
      <button
        className="routine-editor__toggle"
        style={{ '--accent': station.color }}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{routine.name}</span>
        <span className="routine-editor__count">{routine.tasks.length} tasks</span>
        <svg
          className={`routine-editor__chevron${open ? ' open' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="routine-editor__body">
          {/* Playlist */}
          <label className="settings-label">
            Spotify Playlist
            <input
              className="settings-input"
              type="text"
              placeholder="Paste playlist URL or URI…"
              defaultValue={routine.playlistUri}
              onBlur={(e) => handlePlaylistChange(e.target.value.trim())}
            />
          </label>

          {/* Tasks */}
          <p className="settings-label" style={{ marginBottom: 8 }}>Tasks</p>
          <ul className="task-edit-list">
            {routine.tasks.map((task) => (
              <li key={task.id} className="task-edit-item">
                <input
                  className="settings-input task-edit-input"
                  defaultValue={task.text}
                  onBlur={(e) => handleTaskBlur(task.id, e.target.value)}
                />
                <button
                  className="task-delete-btn"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label="Delete task"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="task-add-row">
            <input
              className="settings-input"
              type="text"
              placeholder="New task…"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button
              className="task-add-btn"
              style={{ '--accent': station.color }}
              onClick={handleAddTask}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Station editor ───────────────────────────────────────────────────────────

function StationEditor({ station, onUpdateRoutine }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="station-editor">
      <button
        className="station-editor__toggle"
        style={{ '--accent': station.color }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="station-editor__icon">{station.icon}</span>
        <span className="station-editor__name">{station.name}</span>
        <svg
          className={`station-editor__chevron${open ? ' open' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="station-editor__body">
          {station.routines.map((routine) => (
            <RoutineEditor
              key={routine.id}
              station={station}
              routine={routine}
              onUpdateRoutine={onUpdateRoutine}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Spotify section ──────────────────────────────────────────────────────────

function SpotifySection({ spotifyState, spotify }) {
  const [clientId, setClientId] = useState(spotifyState.clientId ?? '')
  const [pending, setPending] = useState(false)

  const handleConnect = async () => {
    const id = clientId.trim()
    if (!id) return
    setPending(true)
    await spotify.login(id)
    // Page will redirect; this won't run
  }

  if (spotifyState.connected) {
    return (
      <div className="spotify-section">
        <div className="spotify-connected">
          <div className="spotify-status-dot" />
          <div className="spotify-status-info">
            <span className="spotify-status-label">Spotify Connected</span>
            <span className="spotify-status-sub">
              {spotify.playerReady ? 'Tablet player ready' : 'Connecting player…'}
            </span>
          </div>
        </div>
        <p className="settings-hint">
          When a routine starts, the assigned playlist will play directly from this tablet.
          Requires Spotify Premium.
        </p>
        <button className="settings-btn-danger" onClick={spotify.disconnect}>
          Disconnect Spotify
        </button>
      </div>
    )
  }

  return (
    <div className="spotify-section">
      <p className="settings-hint">
        Connect Spotify to auto-play playlists when routines start. Audio plays directly
        from this tablet. Requires Spotify Premium and a registered Developer App.
      </p>
      <label className="settings-label">
        Spotify Client ID
        <input
          className="settings-input"
          type="text"
          placeholder="Your app's client ID…"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
      </label>
      <button
        className="spotify-connect-btn"
        disabled={!clientId.trim() || pending}
        onClick={handleConnect}
      >
        {pending ? 'Redirecting…' : 'Connect Spotify'}
      </button>
      <p className="settings-hint settings-hint--small">
        See README for how to register a Spotify app and set the redirect URI.
      </p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SettingsScreen({
  state,
  updateRoutine,
  updateSettings,
  spotify,
  onBack,
}) {
  const isChecklist = state.settings.viewMode === 'checklist'

  return (
    <div className="screen settings-screen">
      <header className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="screen-header__title">Settings</div>
        <div style={{ width: 52 }} />
      </header>

      <div className="settings-scroll">

        {/* Display */}
        <SectionHeader>Display Mode</SectionHeader>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <p className="settings-row__title">Task view</p>
              <p className="settings-row__sub">
                {isChecklist ? 'Show all tasks as a checklist' : 'Show one task at a time'}
              </p>
            </div>
            <div className="mode-toggle-group">
              <button
                className={`mode-toggle-btn${isChecklist ? ' active' : ''}`}
                onClick={() => updateSettings({ viewMode: 'checklist' })}
              >
                Checklist
              </button>
              <button
                className={`mode-toggle-btn${!isChecklist ? ' active' : ''}`}
                onClick={() => updateSettings({ viewMode: 'single' })}
              >
                One at a time
              </button>
            </div>
          </div>
        </div>

        {/* Spotify */}
        <SectionHeader>Spotify</SectionHeader>
        <div className="settings-card">
          <SpotifySection
            spotifyState={state.settings.spotify}
            spotify={spotify}
          />
        </div>

        {/* Routines */}
        <SectionHeader>Routines &amp; Tasks</SectionHeader>
        <div className="settings-card settings-card--plain">
          {state.stations.map((station) => (
            <StationEditor
              key={station.id}
              station={station}
              onUpdateRoutine={updateRoutine}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
