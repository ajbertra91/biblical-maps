// Builds public/terrain/*.bin from AWS Terrain Tiles (Terrarium PNG, open data: SRTM, ETOPO1 and others).
// Usage: node scripts/build-terrain.mjs
// Each .bin is a row-major Int16 grid of metres (north row first). A .json beside it holds the bounds.
import { mkdirSync, writeFileSync } from 'node:fs'
import { PNG } from 'pngjs'

const URL = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`
const tileX = (lon, z) => ((lon + 180) / 360) * 2 ** z
const tileY = (lat, z) => {
  const r = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z
}
const lonOf = (x, z) => (x / 2 ** z) * 360 - 180
const latOf = (y, z) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))) * 180) / Math.PI

async function tile(z, x, y) {
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(URL(z, x, y))
      if (res.ok) return PNG.sync.read(Buffer.from(await res.arrayBuffer()))
    } catch {}
    await new Promise((r) => setTimeout(r, 500 * (i + 1)))
  }
  throw new Error(`tile ${z}/${x}/${y}`)
}

async function build(name, z, b) {
  const x0 = Math.floor(tileX(b.lon0, z)), x1 = Math.floor(tileX(b.lon1, z))
  const y0 = Math.floor(tileY(b.lat1, z)), y1 = Math.floor(tileY(b.lat0, z))
  const W = (x1 - x0 + 1) * 256, H = (y1 - y0 + 1) * 256
  const full = new Int16Array(W * H)
  const jobs = []
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) jobs.push([tx, ty])
  for (let i = 0; i < jobs.length; i += 8) {
    await Promise.all(jobs.slice(i, i + 8).map(async ([tx, ty]) => {
      const png = await tile(z, tx, ty)
      for (let r = 0; r < 256; r++) for (let c = 0; c < 256; c++) {
        const p = (r * 256 + c) * 4
        const m = png.data[p] * 256 + png.data[p + 1] + png.data[p + 2] / 256 - 32768
        full[((ty - y0) * 256 + r) * W + (tx - x0) * 256 + c] = Math.round(m)
      }
    }))
  }
  // Crop to the requested bounds. Rows are linear in Web Mercator y, so crop by tile coordinate.
  const cx0 = Math.floor((tileX(b.lon0, z) - x0) * 256), cx1 = Math.ceil((tileX(b.lon1, z) - x0) * 256)
  const cy0 = Math.floor((tileY(b.lat1, z) - y0) * 256), cy1 = Math.ceil((tileY(b.lat0, z) - y0) * 256)
  const w = cx1 - cx0, h = cy1 - cy0
  const out = new Int16Array(w * h)
  for (let r = 0; r < h; r++) out.set(full.subarray((cy0 + r) * W + cx0, (cy0 + r) * W + cx0 + w), r * w)
  mkdirSync('public/terrain', { recursive: true })
  writeFileSync(`public/terrain/${name}.bin`, Buffer.from(out.buffer))
  const bounds = { lon0: lonOf(x0 + cx0 / 256, z), lon1: lonOf(x0 + cx1 / 256, z), lat1: latOf(y0 + cy0 / 256, z), lat0: latOf(y0 + cy1 / 256, z) }
  writeFileSync(`public/terrain/${name}.json`, JSON.stringify({ w, h, z, ...bounds }))
  let lo = 1e9, hi = -1e9
  for (const v of out) { if (v < lo) lo = v; if (v > hi) hi = v }
  console.log(name, w, h, `${(out.byteLength / 1e6).toFixed(1)} MB`, 'min', lo, 'max', hi)
}

// The whole land, from Dan to Eilat and from the sea to Gilead.
await build('land', 9, { lon0: 34.0, lon1: 36.3, lat0: 29.4, lat1: 33.5 })
// Jerusalem and its hills at about 15 m.
await build('jerusalem', 13, { lon0: 35.14, lon1: 35.30, lat0: 31.70, lat1: 31.84 })
