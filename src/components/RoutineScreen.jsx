import { useState, useCallback } from 'react'

function SpotifyBar({ spotify }) {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, playerReady } = spotify
  if (!playerReady && !currentTrack) return null

  const trackName = currentTrack?.name ?? '—'
  const artistName = currentTrack?.artists?.map((a) => a.name).join(', ') ?? ''

  return (
    <div className="spotify-bar">
      <div className="spotify-bar__track">
        {currentTrack?.album?.images?.[2]?.url && (
          <img
            className="spotify-bar__art"
            src={currentTrack.album.images[2].url}
            alt="album art"
          />
        )}
        <div className="spotify-bar__info">
          <span className="spotify-bar__name">{trackName}</span>
          {artistName && <span className="spotify-bar__artist">{artistName}</span>}
        </div>
      </div>
      <div className="spotify-bar__controls">
        <button className="spotify-ctrl" onClick={prevTrack} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>
        <button className="spotify-ctrl spotify-ctrl--play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <button className="spotify-ctrl" onClick={nextTrack} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zm7.5-3.86h2v12h-2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Checklist mode ───────────────────────────────────────────────────────────

function ChecklistMode({ tasks, checked, onToggle, onComplete, accentColor }) {
  const allDone = tasks.length > 0 && tasks.every((t) => checked.has(t.id))

  return (
    <div className="routine-content">
      <ul className="task-list">
        {tasks.map((task) => {
          const done = checked.has(task.id)
          return (
            <li key={task.id}>
              <button
                className={`task-item${done ? ' task-item--done' : ''}`}
                style={{ '--accent': accentColor }}
                onClick={() => onToggle(task.id)}
              >
                <span className="task-item__check">
                  {done ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : null}
                </span>
                <span className="task-item__text">{task.text}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="routine-footer">
        <button
          className="complete-btn"
          style={{ '--accent': accentColor }}
          disabled={!allDone}
          onClick={onComplete}
        >
          {allDone ? 'Complete Routine ✓' : `${tasks.filter((t) => checked.has(t.id)).length} / ${tasks.length} done`}
        </button>
      </div>
    </div>
  )
}

// ─── Single-task mode ─────────────────────────────────────────────────────────

function SingleMode({ tasks, onComplete, accentColor }) {
  const [index, setIndex] = useState(0)
  const [doneSet, setDoneSet] = useState(new Set())

  const task = tasks[index]
  const isDone = doneSet.has(task?.id)
  const allDone = doneSet.size === tasks.length

  const markDone = () => {
    setDoneSet((s) => new Set([...s, task.id]))
    if (index < tasks.length - 1) setIndex(index + 1)
  }

  const go = (dir) => {
    const next = index + dir
    if (next >= 0 && next < tasks.length) setIndex(next)
  }

  if (allDone) {
    return (
      <div className="routine-content routine-content--center">
        <div className="complete-splash" style={{ '--accent': accentColor }}>
          <span className="complete-splash__icon">✓</span>
          <span className="complete-splash__label">All done!</span>
        </div>
        <button className="complete-btn" style={{ '--accent': accentColor }} onClick={onComplete}>
          Finish Routine
        </button>
      </div>
    )
  }

  return (
    <div className="routine-content routine-content--center">
      <div className="single-progress">
        {tasks.map((t, i) => (
          <span
            key={t.id}
            className={`single-progress__dot${doneSet.has(t.id) ? ' done' : ''}${i === index ? ' active' : ''}`}
            style={{ '--accent': accentColor }}
          />
        ))}
      </div>
      <p className="single-counter" style={{ color: accentColor }}>
        {index + 1} / {tasks.length}
      </p>
      <div className="single-task-card" style={{ '--accent': accentColor }}>
        <p className="single-task-text">{task.text}</p>
      </div>
      <div className="single-actions">
        <button
          className="single-nav"
          onClick={() => go(-1)}
          disabled={index === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
          className="single-done-btn"
          style={{ '--accent': accentColor }}
          onClick={markDone}
          disabled={isDone}
        >
          {isDone ? 'Done ✓' : 'Mark Done'}
        </button>
        <button
          className="single-nav"
          onClick={() => go(1)}
          disabled={index === tasks.length - 1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RoutineScreen({ station, routine, viewMode, spotify, onBack, onHome }) {
  const [checked, setChecked] = useState(new Set())
  const [completed, setCompleted] = useState(false)

  const toggle = useCallback((id) => {
    setChecked((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleComplete = () => setCompleted(true)

  const progress = routine.tasks.length > 0
    ? Math.round((checked.size / routine.tasks.length) * 100)
    : 0

  if (completed) {
    return (
      <div className="screen routine-screen" style={{ '--accent': station.color }}>
        <div className="completion-screen">
          <div className="completion-glow" style={{ background: station.color }} />
          <div className="completion-check">✓</div>
          <h2 className="completion-title">Routine Complete!</h2>
          <p className="completion-sub">{station.name} — {routine.name}</p>
          <div className="completion-actions">
            <button className="completion-btn" style={{ '--accent': station.color }} onClick={onBack}>
              Back to {station.name}
            </button>
            <button className="completion-btn completion-btn--ghost" onClick={onHome}>
              Home
            </button>
          </div>
        </div>
        {(spotify.playerReady || spotify.currentTrack) && (
          <SpotifyBar spotify={spotify} />
        )}
      </div>
    )
  }

  return (
    <div className="screen routine-screen" style={{ '--accent': station.color }}>
      <header className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="screen-header__title">
          <span style={{ opacity: 0.7, fontSize: '0.85em' }}>{station.name}</span>
          <span style={{ margin: '0 6px', opacity: 0.4 }}>›</span>
          <span>{routine.name}</span>
        </div>
        <button className="icon-btn home-btn" onClick={onHome} aria-label="Home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>
      </header>

      {viewMode === 'checklist' && (
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ '--accent': station.color, width: `${progress}%` }} />
        </div>
      )}

      {viewMode === 'checklist' ? (
        <ChecklistMode
          tasks={routine.tasks}
          checked={checked}
          onToggle={toggle}
          onComplete={handleComplete}
          accentColor={station.color}
        />
      ) : (
        <SingleMode
          tasks={routine.tasks}
          onComplete={handleComplete}
          accentColor={station.color}
        />
      )}

      {(spotify.playerReady || spotify.currentTrack) && (
        <SpotifyBar spotify={spotify} />
      )}
    </div>
  )
}
