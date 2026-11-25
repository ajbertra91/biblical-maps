/** Jerusalem through five eras. Outlines are schematic and drawn from published reconstructions.
 *  Areas and populations are scholarly estimates and vary widely between sources. */

export type LonLat = [lon: number, lat: number]

export type EraId = 'david' | 'solomon' | 'exile' | 'jesus' | 'today'

export interface Landmark {
  id: string
  name: string
  at: LonLat
  /** Footprint in metres (east-west, north-south) and height in metres. */
  size: [number, number, number]
  kind: 'temple' | 'palace' | 'fort' | 'dome' | 'gate' | 'church' | 'tower' | 'platform'
  ref?: string
}

export interface Era {
  id: EraId
  name: string
  /** Display date. Negative years are BC. */
  date: string
  ruler: string
  /** City outline, closed. Walled area for ancient eras, the Old City for today. */
  outline: LonLat[]
  /** Set when the city has spread beyond the walls. Only used for today. */
  sprawl?: number
  /** Approximate area of the whole inhabited city in hectares. */
  hectares: number
  /** Population estimate range for the whole city. */
  population: [number, number]
  /** Approximate number of house blocks drawn per hectare. */
  density: number
  blurb: string
  ref: string
  landmarks: Landmark[]
}

/** Named hills and valleys, shown on every era. */
export const FEATURES: { id: string; name: string; at: LonLat; kind: 'hill' | 'valley' | 'spring' }[] = [
  { id: 'moriah', name: 'Mount Moriah', at: [35.2354, 31.7780], kind: 'hill' },
  { id: 'ophel', name: 'City of David (Ophel ridge)', at: [35.2363, 31.7738], kind: 'hill' },
  { id: 'zion', name: 'Western hill (Mount Zion)', at: [35.2290, 31.7720], kind: 'hill' },
  { id: 'olives', name: 'Mount of Olives', at: [35.2450, 31.7785], kind: 'hill' },
  { id: 'scopus', name: 'Mount Scopus', at: [35.2435, 31.7943], kind: 'hill' },
  { id: 'kidron', name: 'Kidron Valley', at: [35.2398, 31.7760], kind: 'valley' },
  { id: 'hinnom', name: 'Hinnom Valley', at: [35.2268, 31.7650], kind: 'valley' },
  { id: 'tyropoeon', name: 'Tyropoeon (Central) Valley', at: [35.2330, 31.7745], kind: 'valley' },
  { id: 'gihon', name: 'Gihon Spring', at: [35.2364, 31.7704], kind: 'spring' },
]

export const ERAS: Era[] = [
  {
    id: 'david',
    name: 'David',
    date: 'c. 1000 BC',
    ruler: 'King David',
    outline: [[35.2343, 31.7762], [35.2368, 31.7766], [35.2376, 31.7742], [35.2373, 31.7716], [35.2354, 31.7706], [35.2341, 31.7725]],
    hectares: 5,
    population: [1000, 2000],
    density: 12,
    blurb: 'David takes the Jebusite stronghold and calls it the City of David. It sits on a narrow spur above the Gihon spring, with steep valleys on both sides.',
    ref: '2 Samuel 5:6-9',
    landmarks: [
      { id: 'stronghold', name: 'Stronghold of Zion', at: [35.2358, 31.7752], size: [40, 30, 14], kind: 'fort', ref: '2 Samuel 5:7' },
      { id: 'threshing', name: 'Threshing floor of Araunah', at: [35.2354, 31.7782], size: [30, 30, 1.5], kind: 'tower', ref: '2 Samuel 24:18' },
    ],
  },
  {
    id: 'solomon',
    name: 'Solomon',
    date: 'c. 950 BC',
    ruler: 'King Solomon',
    outline: [[35.2343, 31.7762], [35.2338, 31.7800], [35.2368, 31.7806], [35.2374, 31.7790], [35.2376, 31.7742], [35.2373, 31.7716], [35.2354, 31.7706], [35.2341, 31.7725]],
    hectares: 14,
    population: [3000, 5000],
    density: 12,
    blurb: 'Solomon builds the Temple on Mount Moriah and a royal palace beside it. The city grows north along the ridge and the Ophel joins the old city to the Temple.',
    ref: '1 Kings 6-7',
    landmarks: [
      { id: 'temple', name: 'Solomon’s Temple', at: [35.2354, 31.7783], size: [30, 90, 28], kind: 'temple', ref: '1 Kings 6:2' },
      { id: 'palace', name: 'Royal palace', at: [35.2354, 31.7768], size: [90, 60, 14], kind: 'palace', ref: '1 Kings 7:1' },
      { id: 'stronghold', name: 'City of David', at: [35.2358, 31.7742], size: [40, 30, 12], kind: 'fort' },
    ],
  },
  {
    id: 'exile',
    name: 'Post-Exile',
    date: 'c. 445 BC',
    ruler: 'Nehemiah',
    outline: [[35.2349, 31.7762], [35.2347, 31.7795], [35.2366, 31.7798], [35.2372, 31.7790], [35.2372, 31.7742], [35.2368, 31.7722], [35.2358, 31.7714], [35.2349, 31.7728]],
    hectares: 10,
    population: [1500, 4000],
    density: 6,
    blurb: 'The Babylonians burned the city in 586 BC. Returned exiles rebuild a small Temple and Nehemiah closes the broken walls in 52 days. The city is far smaller than before and largely empty.',
    ref: 'Nehemiah 2:11-6:15',
    landmarks: [
      { id: 'temple', name: 'Second Temple (Zerubbabel)', at: [35.2354, 31.7783], size: [30, 80, 20], kind: 'temple', ref: 'Ezra 6:15' },
      { id: 'valley', name: 'Valley Gate', at: [35.2343, 31.7715], size: [10, 10, 12], kind: 'gate', ref: 'Nehemiah 2:13' },
    ],
  },
  {
    id: 'jesus',
    name: 'Jesus',
    date: 'c. AD 30',
    ruler: 'Herod’s Jerusalem',
    outline: [
      [35.2352, 31.7704], [35.2366, 31.7708], [35.2377, 31.7722], [35.2379, 31.7748], [35.2384, 31.7775], [35.2380, 31.7800],
      [35.2368, 31.7822], [35.2350, 31.7832], [35.2330, 31.7826], [35.2312, 31.7815], [35.2290, 31.7808], [35.2270, 31.7798],
      [35.2262, 31.7780], [35.2266, 31.7752], [35.2262, 31.7730], [35.2276, 31.7712], [35.2298, 31.7704], [35.2322, 31.7710], [35.2338, 31.7700],
    ],
    hectares: 100,
    population: [40000, 80000],
    density: 14,
    blurb: 'Herod has doubled the Temple platform and rebuilt the Temple in marble and gold. The Upper City climbs the western hill, the Lower City runs down the ridge, and festival crowds swell the population several times over.',
    ref: 'John 2:20; Mark 13:1-2',
    landmarks: [
      { id: 'platform', name: 'Temple platform', at: [35.2358, 31.7783], size: [300, 460, 5], kind: 'platform', ref: 'Mark 13:1' },
      { id: 'temple', name: 'Herod’s Temple', at: [35.2354, 31.7780], size: [50, 100, 50], kind: 'temple', ref: 'John 2:20' },
      { id: 'antonia', name: 'Antonia Fortress', at: [35.2358, 31.7800], size: [60, 40, 38], kind: 'fort', ref: 'Acts 21:34' },
      { id: 'palace', name: 'Herod’s Palace', at: [35.2282, 31.7762], size: [90, 140, 24], kind: 'palace', ref: 'Matthew 2:1' },
      { id: 'pool', name: 'Pool of Siloam', at: [35.2352, 31.7702], size: [40, 25, 1], kind: 'tower', ref: 'John 9:7' },
      { id: 'golgotha', name: 'Golgotha (traditional)', at: [35.2298, 31.7785], size: [12, 12, 14], kind: 'tower', ref: 'John 19:17' },
    ],
  },
  {
    id: 'today',
    name: 'Today',
    date: '2026',
    ruler: 'Modern Jerusalem',
    outline: [
      [35.2282, 31.7765], [35.2262, 31.7790], [35.2288, 31.7818], [35.2325, 31.7840], [35.2400, 31.7828],
      [35.2420, 31.7795], [35.2412, 31.7755], [35.2380, 31.7728], [35.2340, 31.7720], [35.2305, 31.7735],
    ],
    sprawl: 1,
    hectares: 12600,
    population: [900000, 1000000],
    density: 14,
    blurb: 'The Ottoman walls of 1541 enclose the Old City, about 0.9 km² and 35,000 people. Beyond them the modern municipality covers about 126 km² of hills, with roughly a million residents.',
    ref: 'Walls of Suleiman, 1535-1542',
    landmarks: [
      { id: 'platform', name: 'Haram al-Sharif platform', at: [35.2358, 31.7783], size: [300, 460, 5], kind: 'platform' },
      { id: 'dome', name: 'Dome of the Rock', at: [35.2354, 31.7780], size: [50, 50, 35], kind: 'dome' },
      { id: 'aqsa', name: 'Al-Aqsa Mosque', at: [35.2358, 31.7762], size: [40, 80, 18], kind: 'palace' },
      { id: 'sepulchre', name: 'Church of the Holy Sepulchre', at: [35.2298, 31.7785], size: [50, 50, 22], kind: 'church' },
      { id: 'david', name: 'Tower of David', at: [35.2275, 31.7767], size: [20, 20, 30], kind: 'tower' },
    ],
  },
]

export const eraById = (id: EraId) => ERAS.find((e) => e.id === id)!

/** Cities and regions shown as labels over the whole land. */
export const LAND_LABELS: { name: string; at: LonLat; size: 1 | 2 | 3 }[] = [
  { name: 'Jerusalem', at: [35.2354, 31.7780], size: 3 },
  { name: 'Bethlehem', at: [35.2025, 31.7054], size: 2 },
  { name: 'Hebron', at: [35.0998, 31.5326], size: 2 },
  { name: 'Jericho', at: [35.4444, 31.8700], size: 2 },
  { name: 'Shechem', at: [35.2820, 32.2136], size: 2 },
  { name: 'Samaria', at: [35.1936, 32.2761], size: 1 },
  { name: 'Nazareth', at: [35.2978, 32.7021], size: 2 },
  { name: 'Capernaum', at: [35.5750, 32.8811], size: 2 },
  { name: 'Dan', at: [35.6525, 33.2486], size: 1 },
  { name: 'Beersheba', at: [34.7913, 31.2518], size: 2 },
  { name: 'Gaza', at: [34.4667, 31.5], size: 1 },
  { name: 'Joppa', at: [34.7506, 32.0537], size: 1 },
  { name: 'Caesarea', at: [34.8918, 32.5], size: 1 },
  { name: 'Megiddo', at: [35.1839, 32.5853], size: 1 },
  { name: 'Mount Nebo', at: [35.7256, 31.7678], size: 1 },
  { name: 'Mount Hermon', at: [35.7844, 33.4161], size: 1 },
  { name: 'Mount Carmel', at: [35.0400, 32.7400], size: 1 },
  { name: 'Eilat', at: [34.9519, 29.5577], size: 1 },
]

export const SEA_LABELS: { name: string; at: LonLat }[] = [
  { name: 'Mediterranean Sea', at: [34.35, 32.3] },
  { name: 'Sea of Galilee', at: [35.58, 32.82] },
  { name: 'Dead Sea', at: [35.48, 31.5] },
]
