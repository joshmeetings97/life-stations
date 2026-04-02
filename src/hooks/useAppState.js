import { useState, useEffect } from 'react'
import { DEFAULT_STATIONS, DEFAULT_SETTINGS } from '../data/defaultData'

const STORAGE_KEY = 'routine-tablet-v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function buildInitialState(saved) {
  if (!saved) {
    return { stations: DEFAULT_STATIONS, settings: DEFAULT_SETTINGS }
  }

  // Migrate: fill in empty playlistUri fields from defaults without wiping user edits
  const savedStations = saved.stations ?? DEFAULT_STATIONS
  const stations = savedStations.map((savedStation) => {
    const defaultStation = DEFAULT_STATIONS.find((s) => s.id === savedStation.id)
    if (!defaultStation) return savedStation
    return {
      ...savedStation,
      routines: savedStation.routines.map((savedRoutine) => {
        const defaultRoutine = defaultStation.routines.find((r) => r.id === savedRoutine.id)
        if (!defaultRoutine) return savedRoutine
        return {
          ...savedRoutine,
          playlistUri: savedRoutine.playlistUri || defaultRoutine.playlistUri,
        }
      }),
    }
  })

  return {
    stations,
    settings: {
      ...DEFAULT_SETTINGS,
      ...saved.settings,
      spotify: { ...DEFAULT_SETTINGS.spotify, ...(saved.settings?.spotify ?? {}) },
    },
  }
}

export function useAppState() {
  const [state, setState] = useState(() => buildInitialState(loadFromStorage()))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const updateStations = (stations) =>
    setState((s) => ({ ...s, stations }))

  const updateRoutine = (stationId, routineId, changes) =>
    setState((s) => ({
      ...s,
      stations: s.stations.map((st) =>
        st.id !== stationId
          ? st
          : {
              ...st,
              routines: st.routines.map((r) =>
                r.id !== routineId ? r : { ...r, ...changes }
              ),
            }
      ),
    }))

  const updateSettings = (changes) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...changes } }))

  const updateSpotify = (changes) =>
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        spotify: { ...s.settings.spotify, ...changes },
      },
    }))

  return { state, updateStations, updateRoutine, updateSettings, updateSpotify }
}
