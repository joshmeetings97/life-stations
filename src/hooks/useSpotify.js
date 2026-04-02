import { useCallback, useEffect, useRef, useState } from 'react'

const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ')

// ─── PKCE helpers ───────────────────────────────────────────────────────────

function generateVerifier(length = 128) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, (v) => chars[v % chars.length]).join('')
}

async function generateChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// ─── SDK loader ─────────────────────────────────────────────────────────────

function loadSpotifySDK() {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve()
      return
    }
    const existing = document.querySelector('script[src*="spotify-player"]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.head.appendChild(script)
    }
    window.onSpotifyWebPlaybackSDKReady = resolve
  })
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSpotify(spotifyState, updateSpotify) {
  const playerRef = useRef(null)
  const [playerReady, setPlayerReady] = useState(false)
  const [playerState, setPlayerState] = useState(null)

  // Keep a ref to the latest spotifyState so async callbacks don't close over stale values
  const stateRef = useRef(spotifyState)
  useEffect(() => {
    stateRef.current = spotifyState
  }, [spotifyState])

  // ── Token refresh ──────────────────────────────────────────────────────────
  const refreshAccessToken = useCallback(async () => {
    const { refreshToken, clientId } = stateRef.current
    if (!refreshToken || !clientId) return null
    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
        }),
      })
      if (!res.ok) return null
      const data = await res.json()
      updateSpotify({
        accessToken: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        ...(data.refresh_token ? { refreshToken: data.refresh_token } : {}),
      })
      return data.access_token
    } catch {
      return null
    }
  }, [updateSpotify])

  const getToken = useCallback(async () => {
    const { connected, accessToken, expiresAt } = stateRef.current
    if (!connected) return null
    if (Date.now() < expiresAt - 60_000) return accessToken
    return refreshAccessToken()
  }, [refreshAccessToken])

  // ── Web Playback SDK init ──────────────────────────────────────────────────
  useEffect(() => {
    if (!spotifyState.connected || !spotifyState.accessToken) return

    let cancelled = false

    const init = async () => {
      try {
        await loadSpotifySDK()
        if (cancelled) return

        const player = new window.Spotify.Player({
          name: 'Daily Routine Tablet',
          getOAuthToken: async (cb) => {
            const token = await getToken()
            if (token) cb(token)
          },
          volume: 0.8,
        })

        player.addListener('ready', ({ device_id }) => {
          if (cancelled) return
          updateSpotify({ deviceId: device_id })
          setPlayerReady(true)
        })

        player.addListener('not_ready', () => {
          setPlayerReady(false)
        })

        player.addListener('player_state_changed', (state) => {
          setPlayerState(state || null)
        })

        player.addListener('initialization_error', ({ message }) => {
          console.error('[Spotify] Init error:', message)
        })

        player.addListener('authentication_error', ({ message }) => {
          console.error('[Spotify] Auth error:', message)
          // Token may be expired — try to refresh then reconnect
          refreshAccessToken().then((t) => {
            if (t && playerRef.current) playerRef.current.connect()
          })
        })

        player.addListener('account_error', ({ message }) => {
          console.error('[Spotify] Account error (Premium required):', message)
        })

        await player.connect()
        playerRef.current = player
      } catch (err) {
        console.error('[Spotify] SDK init failed:', err)
      }
    }

    init()

    return () => {
      cancelled = true
      if (playerRef.current) {
        playerRef.current.disconnect()
        playerRef.current = null
      }
      setPlayerReady(false)
      setPlayerState(null)
    }
  // Only re-run when connected status changes, not on every token refresh
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyState.connected])

  // ── Login (PKCE) ───────────────────────────────────────────────────────────
  const login = useCallback(async (clientId) => {
    const verifier = generateVerifier()
    const challenge = await generateChallenge(verifier)
    // Normalize redirect URI — strip trailing slash inconsistencies
    const redirectUri = `${window.location.origin}${window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/'}`

    sessionStorage.setItem('spotify_verifier', verifier)
    sessionStorage.setItem('spotify_client_id', clientId)
    sessionStorage.setItem('spotify_redirect_uri', redirectUri)

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    })

    window.location.href = `https://accounts.spotify.com/authorize?${params}`
  }, [])

  // ── OAuth callback handler ─────────────────────────────────────────────────
  const handleCallback = useCallback(
    async (code) => {
      const verifier = sessionStorage.getItem('spotify_verifier')
      const clientId = sessionStorage.getItem('spotify_client_id')
      const redirectUri =
        sessionStorage.getItem('spotify_redirect_uri') ||
        `${window.location.origin}${window.location.pathname}`

      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: verifier,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Token exchange failed: ${err}`)
      }

      const data = await res.json()
      updateSpotify({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        connected: true,
        clientId,
      })

      sessionStorage.removeItem('spotify_verifier')
      sessionStorage.removeItem('spotify_client_id')
      sessionStorage.removeItem('spotify_redirect_uri')
    },
    [updateSpotify]
  )

  // ── Playback controls ──────────────────────────────────────────────────────
  const playPlaylist = useCallback(
    async (playlistUri) => {
      if (!playlistUri) return

      const token = await getToken()
      if (!token) return

      // Accept playlist URL or URI
      let uri = playlistUri.trim()
      const urlMatch = uri.match(/spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/)
      if (urlMatch) {
        uri = `spotify:${urlMatch[1]}:${urlMatch[2]}`
      }

      const deviceId = stateRef.current.deviceId
      const qs = deviceId ? `?device_id=${deviceId}` : ''

      try {
        const res = await fetch(`https://api.spotify.com/v1/me/player/play${qs}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ context_uri: uri, position_ms: 0 }),
        })
        if (!res.ok && res.status !== 204) {
          const err = await res.json().catch(() => ({}))
          console.warn('[Spotify] Play failed:', err)
        }
      } catch (err) {
        console.error('[Spotify] playPlaylist error:', err)
      }
    },
    [getToken]
  )

  const togglePlay = useCallback(() => {
    playerRef.current?.togglePlay()
  }, [])

  const nextTrack = useCallback(() => {
    playerRef.current?.nextTrack()
  }, [])

  const prevTrack = useCallback(() => {
    playerRef.current?.previousTrack()
  }, [])

  const setVolume = useCallback((vol) => {
    playerRef.current?.setVolume(vol)
  }, [])

  const disconnect = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.disconnect()
      playerRef.current = null
    }
    updateSpotify({
      connected: false,
      accessToken: '',
      refreshToken: '',
      expiresAt: 0,
      deviceId: null,
    })
    setPlayerReady(false)
    setPlayerState(null)
  }, [updateSpotify])

  const currentTrack = playerState?.track_window?.current_track ?? null
  const isPlaying = playerState ? !playerState.paused : false

  return {
    login,
    handleCallback,
    playPlaylist,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    disconnect,
    playerReady,
    playerState,
    currentTrack,
    isPlaying,
  }
}
