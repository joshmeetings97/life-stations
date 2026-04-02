export default function StationScreen({ station, onSelectRoutine, onBack }) {
  return (
    <div className="screen station-screen" style={{ '--accent': station.color }}>
      <header className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="screen-header__title">
          <span className="screen-header__icon">{station.icon}</span>
          <span>{station.name}</span>
        </div>
        <div style={{ width: 52 }} />
      </header>

      <div className="routines-list">
        <p className="routines-label">Choose a routine</p>
        {station.routines.map((routine) => (
          <button
            key={routine.id}
            className="routine-btn"
            onClick={() => onSelectRoutine(routine.id)}
          >
            <span className="routine-btn__name">{routine.name}</span>
            <span className="routine-btn__meta">
              {routine.tasks.length} task{routine.tasks.length !== 1 ? 's' : ''}
            </span>
            <svg className="routine-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
