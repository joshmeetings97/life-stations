// Spotify editorial playlist URIs — all are public Spotify-managed playlists.
// Users can override any of these in Settings → Routines & Tasks.
const PL = {
  MORNING_MOTIVATION:  'spotify:playlist:37i9dQZF1DX3rxVfibe1L0', // Morning Motivation
  GOOD_MORNING:        'spotify:playlist:37i9dQZF1DXdPec7aLTmlC', // Good Morning
  WAKE_UP_HAPPY:       'spotify:playlist:37i9dQZF1DX0UrRvztWcTL', // Wake Up Happy
  DEEP_FOCUS:          'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', // Deep Focus
  FOCUS_FLOW:          'spotify:playlist:37i9dQZF1DWZZbwlv3Vmtr', // Focus Flow
  CHILL_HITS:          'spotify:playlist:37i9dQZF1DX4WYpdgoIcn6', // Chill Hits
  PEACEFUL_PIANO:      'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
  SLEEP:               'spotify:playlist:37i9dQZF1DWZd79rJ6a7lp', // Sleep
  BEAST_MODE:          'spotify:playlist:37i9dQZF1DX76Wlfdnj7AP', // Beast Mode
  COOL_DOWN:           'spotify:playlist:37i9dQZF1DWTkxQvqMy4WW', // Cool Down & Stretch
}

export const DEFAULT_STATIONS = [
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: '🚿',
    color: '#29B6F6',
    routines: [
      {
        id: 'bathroom-morning',
        name: 'Morning',
        playlistUri: PL.MORNING_MOTIVATION,
        tasks: [
          { id: 'bm1', text: 'Brush teeth' },
          { id: 'bm2', text: 'Shower' },
          { id: 'bm3', text: 'Wash face + moisturizer' },
          { id: 'bm4', text: 'Deodorant' },
          { id: 'bm5', text: 'Medication / supplements' },
          { id: 'bm6', text: 'Hair' },
        ],
      },
      {
        id: 'bathroom-evening',
        name: 'Evening',
        playlistUri: PL.PEACEFUL_PIANO,
        tasks: [
          { id: 'be1', text: 'Wash face + moisturizer' },
          { id: 'be2', text: 'Floss + brush teeth' },
          { id: 'be3', text: 'Medication if evening dose' },
        ],
      },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: '🍳',
    color: '#FF8C42',
    routines: [
      {
        id: 'kitchen-morning',
        name: 'Morning',
        playlistUri: PL.GOOD_MORNING,
        tasks: [
          { id: 'km1', text: 'Drink a full glass of water' },
          { id: 'km2', text: 'Make coffee / breakfast' },
          { id: 'km3', text: 'Take supplements with food' },
          { id: 'km4', text: 'Wipe down counter before you leave' },
        ],
      },
      {
        id: 'kitchen-evening',
        name: 'Evening',
        playlistUri: PL.CHILL_HITS,
        tasks: [
          { id: 'ke1', text: 'Do dishes / run dishwasher' },
          { id: 'ke2', text: 'Wipe down counter and island' },
          { id: 'ke3', text: 'Check fridge / plan tomorrow\'s food' },
          { id: 'ke4', text: 'Empty trash if full' },
        ],
      },
    ],
  },
  {
    id: 'desk',
    name: 'Desk / Living Room',
    icon: '💻',
    color: '#66BB6A',
    routines: [
      {
        id: 'desk-morning',
        name: 'Morning — Start Day',
        playlistUri: PL.DEEP_FOCUS,
        tasks: [
          { id: 'dm1', text: 'Journal — 5 min brain dump' },
          { id: 'dm2', text: 'Write top 3 priorities for the day' },
          { id: 'dm3', text: 'Don\'t open social media yet' },
        ],
      },
      {
        id: 'desk-precall',
        name: 'Pre-Call Quick Check',
        playlistUri: PL.FOCUS_FLOW,
        tasks: [
          { id: 'dp1', text: 'Check background is clean' },
          { id: 'dp2', text: 'Headphones / mic ready' },
          { id: 'dp3', text: 'Glass of water' },
          { id: 'dp4', text: 'Close irrelevant tabs' },
          { id: 'dp5', text: 'Mute notifications' },
        ],
      },
      {
        id: 'desk-focus',
        name: 'Focus Mode',
        playlistUri: PL.DEEP_FOCUS,
        tasks: [
          { id: 'df1', text: 'Write today\'s top 3 work priorities' },
          { id: 'df2', text: 'Glass of water at your desk' },
          { id: 'df3', text: 'Close irrelevant tabs' },
          { id: 'df4', text: 'Mute notifications — Do Not Disturb on' },
        ],
      },
      {
        id: 'desk-evening',
        name: 'Evening — Wind Down',
        playlistUri: PL.CHILL_HITS,
        tasks: [
          { id: 'de1', text: '5 min living room tidy' },
          { id: 'de2', text: 'Write 3 things you got done today' },
          { id: 'de3', text: 'Plan tomorrow\'s top 3' },
          { id: 'de4', text: 'Phone down and dim the lights' },
        ],
      },
    ],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: '🛏️',
    color: '#AB47BC',
    routines: [
      {
        id: 'bedroom-morning',
        name: 'Morning',
        playlistUri: PL.WAKE_UP_HAPPY,
        tasks: [
          { id: 'brm1', text: 'Make the bed immediately' },
          { id: 'brm2', text: 'Open the blinds' },
          { id: 'brm3', text: 'Quick 2 min stretch' },
          { id: 'brm4', text: 'No phone for first 10 min' },
        ],
      },
      {
        id: 'bedroom-bedtime',
        name: 'Bedtime',
        playlistUri: PL.SLEEP,
        tasks: [
          { id: 'brb1', text: 'Lay out tomorrow\'s clothes' },
          { id: 'brb2', text: 'Phone on charger face down' },
          { id: 'brb3', text: 'Set your alarm' },
          { id: 'brb4', text: 'Read or journal — no scrolling' },
        ],
      },
    ],
  },
  {
    id: 'gym',
    name: 'Gym',
    icon: '💪',
    color: '#EF5350',
    routines: [
      {
        id: 'gym-pre',
        name: 'Pre-Workout',
        playlistUri: PL.BEAST_MODE,
        tasks: [
          { id: 'gp1', text: 'Drink water' },
          { id: 'gp2', text: 'Light snack if needed' },
          { id: 'gp3', text: 'Grab gym bag / gear' },
        ],
      },
      {
        id: 'gym-post',
        name: 'Post-Workout',
        playlistUri: PL.COOL_DOWN,
        tasks: [
          { id: 'go1', text: 'Protein / recovery food' },
          { id: 'go2', text: 'Stretch 5 min' },
          { id: 'go3', text: 'Log your workout' },
          { id: 'go4', text: 'Shower within 30 min' },
        ],
      },
    ],
  },
]

export const DEFAULT_SETTINGS = {
  viewMode: 'checklist', // 'checklist' | 'single'
  defaultStationId: null, // null = show Home screen; station id = open that station on load
  spotify: {
    clientId: '',
    accessToken: '',
    refreshToken: '',
    expiresAt: 0,
    deviceId: null,
    connected: false,
  },
}
