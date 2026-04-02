import { useState, useEffect } from 'react'
import HomeScreen from './components/HomeScreen'
import StationScreen from './components/StationScreen'
import RoutineScreen from './components/RoutineScreen'
import SettingsScreen from './components/SettingsScreen'
import { useAppState } from './hooks/useAppState'
import { useSpotify } from './hooks/useSpotify'

export default function App() {
  const { state, updateStations, updateRoutine, updateSettings, updateSpotify } = useAppState()
  const [view, setView] = useState('home')
  const [currentStationId, setCurrentStationId] = useState(null)
  const [currentRoutineId, setCurrentRoutineId] = useState(null)

  const spotify = useSpotify(state.settings.spotify, updateSpotify)

  // Handle Spotify OAuth callback on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (code) {
      spotify
        .handleCallback(code)
        .then(() => {
          window.history.replaceState({}, '', window.location.pathname)
          setView('settings')
        })
        .catch((err) => {
          console.error('Spotify auth error:', err)
          window.history.replaceState({}, '', window.location.pathname)
        })
    } else if (error) {
      console.error('Spotify auth denied:', error)
      window.history.replaceState({}, '', window.location.pathname)
    }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentStation = state.stations.find((s) => s.id === currentStationId) ?? null
  const currentRoutine = currentStation?.routines.find((r) => r.id === currentRoutineId) ?? null

  const handleSelectStation = (stationId) => {
    setCurrentStationId(stationId)
    setView('station')
  }

  const handleSelectRoutine = (routineId) => {
    const station = state.stations.find((s) => s.id === currentStationId)
    const routine = station?.routines.find((r) => r.id === routineId)

    setCurrentRoutineId(routineId)
    setView('routine')

    if (routine?.playlistUri && state.settings.spotify.connected) {
      spotify.playPlaylist(routine.playlistUri)
    }
  }

  const handleBackFromStation = () => {
    setView('home')
    setCurrentStationId(null)
  }

  const handleBackFromRoutine = () => {
    setView('station')
    setCurrentRoutineId(null)
  }

  const handleHome = () => {
    setView('home')
    setCurrentStationId(null)
    setCurrentRoutineId(null)
  }

  return (
    <div className="app">
      {view === 'home' && (
        <HomeScreen
          stations={state.stations}
          onSelectStation={handleSelectStation}
          onOpenSettings={() => setView('settings')}
        />
      )}

      {view === 'station' && currentStation && (
        <StationScreen
          station={currentStation}
          onSelectRoutine={handleSelectRoutine}
          onBack={handleBackFromStation}
        />
      )}

      {view === 'routine' && currentRoutine && currentStation && (
        <RoutineScreen
          station={currentStation}
          routine={currentRoutine}
          viewMode={state.settings.viewMode}
          spotify={spotify}
          onBack={handleBackFromRoutine}
          onHome={handleHome}
        />
      )}

      {view === 'settings' && (
        <SettingsScreen
          state={state}
          updateStations={updateStations}
          updateRoutine={updateRoutine}
          updateSettings={updateSettings}
          updateSpotify={updateSpotify}
          spotify={spotify}
          onBack={handleHome}
        />
      )}
    </div>
  )
}
