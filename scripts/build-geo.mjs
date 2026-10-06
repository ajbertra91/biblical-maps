// Builds src/data/geo.ts from Natural Earth (public domain) GeoJSON.
// Usage: node scripts/build-geo.mjs <dir with ne_10m_*.geojson>
import { readFileSync, writeFileSync } from 'node:fs'

const dir = process.argv[2] ?? '../.work'
// Rome in the west, Nubia in the south, the Caucasus in the north and Parthia in the east.
const B = { lon0: 10.0, lon1: 58.0, lat0: 13.0, lat1: 45.5 }
// Scale stays at 1000 units for 9 degrees, so spans in the map data keep their size.
const scale = 1000 / 9
const W = Math.round((B.lon1 - B.lon0) * scale)
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
const mTop = merc(B.lat1)
const mBot = merc(B.lat0)
const H = Math.round(((mTop - mBot) * 180) / Math.PI * scale)
const px = (lon) => (lon - B.lon0) * scale
const py = (lat) => ((mTop - merc(lat)) * 180) / Math.PI * scale
const PAD = 1.5 // degrees of margin so clip edges stay off-screen

const load = (n) => JSON.parse(readFileSync(`${dir}/${n}.geojson`, 'utf8')).features

function inBox(lon, lat) {
  return lon > B.lon0 - PAD && lon < B.lon1 + PAD && lat > B.lat0 - PAD && lat < B.lat1 + PAD
}

// Sutherland-Hodgman against the padded box, in lon/lat space.
function clipRing(ring) {
  const edges = [
    [(p) => p[0] >= B.lon0 - PAD, (a, b) => { const t = (B.lon0 - PAD - a[0]) / (b[0] - a[0]); return [B.lon0 - PAD, a[1] + t * (b[1] - a[1])] }],
    [(p) => p[0] <= B.lon1 + PAD, (a, b) => { const t = (B.lon1 + PAD - a[0]) / (b[0] - a[0]); return [B.lon1 + PAD, a[1] + t * (b[1] - a[1])] }],
    [(p) => p[1] >= B.lat0 - PAD, (a, b) => { const t = (B.lat0 - PAD - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), B.lat0 - PAD] }],
    [(p) => p[1] <= B.lat1 + PAD, (a, b) => { const t = (B.lat1 + PAD - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), B.lat1 + PAD] }],
  ]
  let out = ring
  for (const [inside, cut] of edges) {
    const inp = out
    out = []
    for (let i = 0; i < inp.length; i++) {
      const cur = inp[i]
      const prev = inp[(i + inp.length - 1) % inp.length]
      if (inside(cur)) {
        if (!inside(prev)) out.push(cut(prev, cur))
        out.push(cur)
      } else if (inside(prev)) out.push(cut(prev, cur))
    }
    if (!out.length) return []
  }
  return out
}

function dp(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    let max = 0
    let idx = -1
    const [ax, ay] = pts[a]
    const [bx, by] = pts[b]
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy) || 1e-9
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len
      if (d > max) { max = d; idx = i }
    }
    if (max > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]) }
  }
  return pts.filter((_, i) => keep[i])
}

const f1 = (n) => Math.round(n * 10) / 10
function toPath(pts, close) {
  const s = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('')
  return close ? s + 'Z' : s
}

function polys(geom) {
  if (geom.type === 'Polygon') return [geom.coordinates]
  if (geom.type === 'MultiPolygon') return geom.coordinates
  return []
}

function areaPath(features, tol, minArea) {
  let d = ''
  for (const f of features) {
    for (const poly of polys(f.geometry)) {
      poly.forEach((ring) => {
        if (!ring.some(([lo, la]) => inBox(lo, la))) return
        const c = clipRing(ring)
        if (c.length < 3) return
        const q0 = c.map(([lo, la]) => [px(lo), py(la)])
        const last = q0[q0.length - 1]
        if (q0[0][0] === last[0] && q0[0][1] === last[1]) q0.pop()
        const mid = q0.length >> 1
        const p = [...dp(q0.slice(0, mid + 1), tol), ...dp([...q0.slice(mid), q0[0]], tol).slice(1, -1)]
        if (p.length < 3) return
        let a = 0
        for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1] }
        if (Math.abs(a / 2) < minArea) return
        d += toPath(p, true)
      })
    }
  }
  return d
}

function linePath(features, tol, keep) {
  const out = []
  for (const f of features) {
    if (keep && !keep(f.properties)) continue
    const g = f.geometry
    const lines = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []
    for (const line of lines) {
      // split into runs inside the box
      let run = []
      const flush = () => {
        if (run.length > 1) out.push(toPath(dp(run, tol), false))
        run = []
      }
      for (const [lo, la] of line) {
        if (lo >= B.lon0 - 0.2 && lo <= B.lon1 + 0.2 && la >= B.lat0 - 0.2 && la <= B.lat1 + 0.2) run.push([px(lo), py(la)])
        else flush()
      }
      flush()
    }
  }
  return out.join('')
}

const land = areaPath(load('ne_10m_land'), 0.18, 0)
const lakes = areaPath(load('ne_10m_lakes'), 0.18, 4)
const rivers = linePath(load('ne_10m_rivers_lake_centerlines'), 0.25)

const ts = `// Generated by scripts/build-geo.mjs from Natural Earth 1:10m (public domain).
// Do not edit by hand.
export const GEO_BOUNDS = ${JSON.stringify(B)}
export const GEO_W = ${W}
export const GEO_H = ${H}
export const GEO_M_TOP = ${mTop}
export const GEO_SCALE = ${scale}
export const LAND = ${JSON.stringify(land)}
export const LAKES = ${JSON.stringify(lakes)}
export const RIVERS = ${JSON.stringify(rivers)}
`
writeFileSync('src/data/geo.ts', ts)
console.log({ H, land: land.length, lakes: lakes.length, rivers: rivers.length })
