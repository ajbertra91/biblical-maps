import type { Pt } from './data/geo-utils'

/** One camera keyframe. Key 0 is the overview. The others are stops. */
export interface Key {
  x: number
  y: number
  /** Map units visible along the short screen side. Absent on the overview. */
  s?: number
  /** Points the overview must fit. */
  fit?: Pt[]
  /** Extra room around the fit points, as a factor. The overview needs it to clear the panel and the stop list. */
  pad?: number
}

export interface Cam {
  x: number
  y: number
  s: number
}

const MARGIN = 1.35
const MIN_SPAN = 60

/** Short-side span that fits the points at this aspect ratio. */
export function fitSpan(points: Pt[], aspect: number): number {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const bw = (Math.max(...xs) - Math.min(...xs)) * MARGIN
  const bh = (Math.max(...ys) - Math.min(...ys)) * MARGIN
  const s = aspect >= 1 ? Math.max(bh, bw / aspect) : Math.max(bw, bh * aspect)
  return Math.max(s, MIN_SPAN)
}

export function centerOf(points: Pt[]): Pt {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  return [(Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2]
}

// A key with points to fit and a span shows whichever is larger.
const spanOf = (k: Key, aspect: number) => (k.fit ? Math.max(fitSpan(k.fit, aspect) * (k.pad ?? 1), k.s ?? 0) : k.s ?? fitSpan([[k.x, k.y]], aspect))

/** Smooth ease for the flight between two stops. */
export const flight = (u: number) => {
  const x = Math.min(1, Math.max(0, (u - 0.28) / 0.44))
  return x * x * (3 - 2 * x)
}

/** Camera at scroll position t. Whole numbers are stops. Between them the camera pulls back. */
export function cameraAt(keys: Key[], t: number, aspect: number): Cam {
  const last = keys.length - 1
  const tc = Math.min(last, Math.max(0, t))
  const i = Math.min(last - 1, Math.floor(tc))
  const a = keys[i]
  const b = keys[i + 1] ?? a
  const e = flight(tc - i)
  const sa = spanOf(a, aspect)
  const sb = spanOf(b, aspect)
  const pair = fitSpan([[a.x, a.y], [b.x, b.y]], aspect)
  const bump = Math.max(0, Math.log(pair) - Math.log(Math.max(sa, sb)))
  const lnS = Math.log(sa) + (Math.log(sb) - Math.log(sa)) * e + bump * Math.sin(Math.PI * e)
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, s: Math.exp(lnS) }
}

/** ViewBox for a camera and viewport. */
export function viewBox(c: Cam, w: number, h: number) {
  const aspect = w / h
  const vw = aspect >= 1 ? c.s * aspect : c.s
  const vh = aspect >= 1 ? c.s : c.s / aspect
  return { x: c.x - vw / 2, y: c.y - vh / 2, w: vw, h: vh }
}
