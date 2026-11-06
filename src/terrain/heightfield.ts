import type { LonLat } from '../data/jerusalem'

export interface Bounds { lon0: number; lon1: number; lat0: number; lat1: number }
export interface Meta extends Bounds { w: number; h: number }

const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))

/** Where the world's origin sits: the Temple Mount. */
export const ORIGIN: LonLat = [35.2354, 31.778]
const KM_PER_LAT = 110.95
const KM_PER_LON = 111.32 * Math.cos((ORIGIN[1] * Math.PI) / 180)

/** Kilometres east and south of the origin. North is -z, as in three.js's default camera. */
export const toKm = (lon: number, lat: number): [number, number] => [
  (lon - ORIGIN[0]) * KM_PER_LON,
  -(lat - ORIGIN[1]) * KM_PER_LAT,
]

/** A grid of elevations in metres. Rows run north to south and are even steps in Web Mercator. */
export class Heightfield {
  private mTop: number
  private mBot: number
  constructor(readonly meta: Meta, readonly data: Int16Array) {
    this.mTop = merc(meta.lat1)
    this.mBot = merc(meta.lat0)
  }

  lonAt(col: number) {
    return this.meta.lon0 + (col / (this.meta.w - 1)) * (this.meta.lon1 - this.meta.lon0)
  }

  latAt(row: number) {
    const m = this.mTop + (row / (this.meta.h - 1)) * (this.mBot - this.mTop)
    return ((2 * Math.atan(Math.exp(m)) - Math.PI / 2) * 180) / Math.PI
  }

  contains(lon: number, lat: number) {
    const m = this.meta
    return lon >= m.lon0 && lon <= m.lon1 && lat >= m.lat0 && lat <= m.lat1
  }

  /** Bilinear elevation in metres. Positions off the grid take the nearest edge. */
  elevAt(lon: number, lat: number) {
    const { w, h, lon0, lon1 } = this.meta
    const cx = Math.min(w - 1.001, Math.max(0, ((lon - lon0) / (lon1 - lon0)) * (w - 1)))
    const cy = Math.min(h - 1.001, Math.max(0, ((this.mTop - merc(lat)) / (this.mTop - this.mBot)) * (h - 1)))
    const x = Math.floor(cx), y = Math.floor(cy)
    const fx = cx - x, fy = cy - y
    const d = this.data
    const a = d[y * w + x], b = d[y * w + x + 1], c = d[(y + 1) * w + x], e = d[(y + 1) * w + x + 1]
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + e * fx * fy
  }

  /** Rise over run, from the neighbouring cells. */
  slopeAt(lon: number, lat: number) {
    const dl = 0.0004
    const dx = (this.elevAt(lon + dl, lat) - this.elevAt(lon - dl, lat)) / (2 * dl * KM_PER_LON * 1000)
    const dy = (this.elevAt(lon, lat + dl) - this.elevAt(lon, lat - dl)) / (2 * dl * KM_PER_LAT * 1000)
    return Math.hypot(dx, dy)
  }
}

export function pointInPolygon(lon: number, lat: number, poly: LonLat[]) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Area of a lon/lat polygon in hectares. */
export function polygonHectares(poly: LonLat[]) {
  let a = 0
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = toKm(...poly[j]), [x2, y2] = toKm(...poly[i])
    a += x1 * y2 - x2 * y1
  }
  return (Math.abs(a) / 2) * 100
}

/** A small seeded generator, so a city looks the same every time. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
