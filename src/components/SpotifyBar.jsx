export default function SpotifyBar({ spotify }) {
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
