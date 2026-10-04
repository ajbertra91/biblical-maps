import { GEO_M_TOP, GEO_SCALE, GEO_BOUNDS } from './geo'

export type Pt = [number, number]

const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))

/** Longitude and latitude to map units. */
export function project(lat: number, lon: number): Pt {
  return [
    (lon - GEO_BOUNDS.lon0) * GEO_SCALE,
    (((GEO_M_TOP - merc(lat)) * 180) / Math.PI) * GEO_SCALE,
  ]
}

/** Map units to longitude and latitude. */
export function unproject(x: number, y: number): { lat: number; lon: number } {
  const m = GEO_M_TOP - (y / GEO_SCALE) * (Math.PI / 180)
  return {
    lat: (2 * Math.atan(Math.exp(m)) - Math.PI / 2) * (180 / Math.PI),
    lon: x / GEO_SCALE + GEO_BOUNDS.lon0,
  }
}

/** Great-circle distance in kilometers. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371.0088
  const r = Math.PI / 180
  const dLat = (b.lat - a.lat) * r
  const dLon = (b.lon - a.lon) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Kilometers in one map unit at a latitude. */
export const kmPerUnit = (lat: number) => (111.32 * Math.cos((lat * Math.PI) / 180)) / GEO_SCALE

/** Catmull-Rom leg through p1 and p2. p0 and p3 shape the tangents. */
export function leg(p0: Pt, p1: Pt, p2: Pt, p3: Pt): string {
  // Handles are at most half the leg long, so a far neighbor cannot make the curve loop.
  const max = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 2
  const handle = (dx: number, dy: number): Pt => {
    const k = Math.min(1, max / (Math.hypot(dx, dy) || 1))
    return [dx * k, dy * k]
  }
  const t1 = handle((p2[0] - p0[0]) / 6, (p2[1] - p0[1]) / 6)
  const t2 = handle((p3[0] - p1[0]) / 6, (p3[1] - p1[1]) / 6)
  const c1: Pt = [p1[0] + t1[0], p1[1] + t1[1]]
  const c2: Pt = [p2[0] - t2[0], p2[1] - t2[1]]
  const f = (n: number) => n.toFixed(1)
  return `M${f(p1[0])} ${f(p1[1])}C${f(c1[0])} ${f(c1[1])},${f(c2[0])} ${f(c2[1])},${f(p2[0])} ${f(p2[1])}`
}

/** Smooth path through all the points as one subpath, so a dash can draw it from end to end. */
export function through(pts: Pt[]): string {
  return pts.slice(0, -1).map((p, k) => {
    const d = leg(pts[k - 1] ?? p, p, pts[k + 1], pts[k + 2] ?? pts[k + 1])
    return k === 0 ? d : d.slice(d.indexOf('C'))
  }).join('')
}

/** Convex hull, Andrew's monotone chain. */
export function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (p.length < 3) return p
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Pt[] = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
    lower.push(q)
  }
  const upper: Pt[] = []
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
    upper.push(q)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

/** Hull of the points grown by `r` map units. */
export function paddedHull(points: Pt[], r: number): Pt[] {
  const ring: Pt[] = []
  for (const [x, y] of points) {
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2
      ring.push([x + Math.cos(a) * r, y + Math.sin(a) * r])
    }
  }
  return hull(ring)
}
