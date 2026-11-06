import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Float32BufferAttribute, Group, InstancedMesh,
  LineBasicMaterial, LineLoop, Matrix4, Mesh, MeshLambertMaterial, Object3D, SphereGeometry,
} from 'three'
import { ERAS, FEATURES, type Era, type Landmark, type LonLat } from '../data/jerusalem'
import { Heightfield, pointInPolygon, rng, toKm } from './heightfield'

/** Modern Jerusalem outside the Old City, in broad strokes. */
export const SPRAWL: LonLat[] = [
  [35.14, 31.76], [35.15, 31.725], [35.2, 31.715], [35.245, 31.715], [35.275, 31.735], [35.29, 31.77],
  [35.285, 31.82], [35.26, 31.838], [35.2, 31.835], [35.16, 31.815], [35.142, 31.79],
]

const WALL_HEIGHT: Record<Era['id'], number> = { david: 5, solomon: 7, exile: 5, jesus: 11, today: 12 }
const STONE = [0xd9c9a3, 0xcdb98c, 0xe0d2b0, 0xbfae85]
const TILE = [0xc99a73, 0xd0a883, 0xbd8f69]
const MODERN = [0xe7e2d6, 0xd6d1c4, 0xf0ece1, 0xc9c4b7]

export interface City { group: Group; materials: { opacity: number; transparent: boolean }[]; dispose(): void }

const ERA_LINE: Record<string, number> = { david: 0x7ad0e0, solomon: 0xb08cff, exile: 0x6fe39a, jesus: 0xffb21a }

interface Ctx { hf: Heightfield; exag: number }
/** World y in km for a lon/lat. */
const yAt = ({ hf, exag }: Ctx, lon: number, lat: number) => (hf.elevAt(lon, lat) * exag) / 1000

/** The wall as a ribbon that follows the ground. */
function wall(ctx: Ctx, outline: LonLat[], height: number, color: number) {
  const pos: number[] = []
  const idx: number[] = []
  const rise = (height * Math.max(1, ctx.exag * 0.6)) / 1000
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i], b = outline[(i + 1) % outline.length]
    const [ax, az] = toKm(...a), [bx, bz] = toKm(...b)
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.01))
    const first = pos.length / 3
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const lon = a[0] + (b[0] - a[0]) * t, lat = a[1] + (b[1] - a[1]) * t
      const [x, z] = toKm(lon, lat)
      const y = yAt(ctx, lon, lat)
      pos.push(x, y - 0.004, z, x, y + rise, z)
    }
    for (let s = 0; s < steps; s++) {
      const v = first + s * 2
      idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2)
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return new Mesh(g, new MeshLambertMaterial({ color, side: DoubleSide }))
}

function landmark(ctx: Ctx, l: Landmark, mats: MeshLambertMaterial[]) {
  const g = new Group()
  const [wm, dm, hm] = l.size
  const [x, z] = toKm(...l.at)
  const base = yAt(ctx, ...l.at)
  const mat = (hex: number, emissive = 0) => {
    const m = new MeshLambertMaterial({ color: hex, emissive, emissiveIntensity: 0.3 })
    mats.push(m)
    return m
  }
  const k = 1 / 1000
  const h = hm * k * Math.max(1, ctx.exag * 0.6)
  const sink = 0.02
  const add = (geo: BufferGeometry, m: MeshLambertMaterial, px: number, py: number, pz: number) => {
    const mesh = new Mesh(geo, m)
    mesh.position.set(px, py, pz)
    g.add(mesh)
  }
  const body = (color: number, em = 0) => {
    const box = new BoxGeometry(wm * k, h + sink, dm * k)
    add(box, mat(color, em), 0, (h - sink) / 2, 0)
  }
  switch (l.kind) {
    case 'temple':
      body(0xf1ead6, 0x332a10)
      add(new BoxGeometry(wm * k * 1.04, h * 0.08, dm * k * 1.04), mat(0xe0b341, 0x6b4d00), 0, h, 0)
      break
    case 'palace':
      body(0xcfbf99)
      add(new BoxGeometry(wm * k * 1.05, h * 0.1, dm * k * 1.05), mat(0x9a5f42), 0, h, 0)
      break
    case 'fort': {
      body(0xb8a88a)
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        add(new BoxGeometry(wm * k * 0.22, h * 1.35 + sink, wm * k * 0.22), mat(0xa89877), (sx * wm * k) / 2, (h * 1.35 - sink) / 2, (sz * dm * k) / 2)
      }
      break
    }
    case 'dome':
      add(new CylinderGeometry((wm * k) / 2, (wm * k) / 2, h * 0.45 + sink, 8), mat(0x2f6fa8), 0, (h * 0.45 - sink) / 2, 0)
      add(new SphereGeometry((wm * k) * 0.3, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe8b923, 0x7a5600), 0, h * 0.45, 0)
      break
    case 'church':
      body(0xd9cdb0)
      add(new SphereGeometry(wm * k * 0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xb8b2a4), 0, h, 0)
      break
    case 'gate':
      body(0xc2b08a)
      break
    case 'platform':
      body(0xe4dcc6)
      break
    case 'tower':
      add(new CylinderGeometry((wm * k) / 2, (wm * k) / 1.7, h + sink, 10), mat(0xb9a984), 0, (h - sink) / 2, 0)
      break
  }
  g.position.set(x, base, z)
  return g
}

/** House blocks scattered inside a polygon, thinned out where the ground is steep. */
function houses(ctx: Ctx, poly: LonLat[], count: number, era: Era, seed: number, scale: number, palette: number[], avoid: LonLat[][]) {
  const rand = rng(seed)
  let lo = [1e9, 1e9], hi = [-1e9, -1e9]
  for (const [lon, lat] of poly) {
    lo = [Math.min(lo[0], lon), Math.min(lo[1], lat)]
    hi = [Math.max(hi[0], lon), Math.max(hi[1], lat)]
  }
  const placed: { lon: number; lat: number }[] = []
  let guard = 0
  while (placed.length < count && guard++ < count * 40) {
    const lon = lo[0] + rand() * (hi[0] - lo[0]), lat = lo[1] + rand() * (hi[1] - lo[1])
    if (!pointInPolygon(lon, lat, poly)) continue
    if (avoid.some((a) => pointInPolygon(lon, lat, a))) continue
    const slope = ctx.hf.slopeAt(lon, lat)
    if (slope > (era.id === 'today' ? 0.42 : 0.55) || rand() < slope * 0.9) continue
    // Suburbs thin out with distance from the Old City.
    if (era.sprawl) {
      const [x, z] = toKm(lon, lat)
      if (rand() < Math.min(0.85, Math.hypot(x, z) / 9)) continue
    }
    placed.push({ lon, lat })
  }
  const geo = new BoxGeometry(1, 1, 1)
  geo.translate(0, 0.5, 0)
  const mat = new MeshLambertMaterial({ color: 0xffffff })
  const mesh = new InstancedMesh(geo, mat, placed.length)
  const m = new Matrix4(), o = new Object3D(), c = new Color()
  placed.forEach((p, i) => {
    const [x, z] = toKm(p.lon, p.lat)
    const w = (7 + rand() * 9) * scale, d = (7 + rand() * 9) * scale
    const upper = era.id === 'jesus' && p.lon < 35.2335 && p.lat > 31.7705
    const hMax = era.id === 'today' ? 14 : upper ? 9 : 6
    const hh = (3 + rand() * hMax) * Math.max(1, ctx.exag * 0.6)
    o.position.set(x, yAt(ctx, p.lon, p.lat) - 0.002, z)
    o.rotation.set(0, (rand() - 0.5) * 0.9, 0)
    o.scale.set(w / 1000, hh / 1000 + 0.002, d / 1000)
    o.updateMatrix()
    m.copy(o.matrix)
    mesh.setMatrixAt(i, m)
    c.setHex(palette[Math.floor(rand() * palette.length)])
    c.offsetHSL(0, 0, (rand() - 0.5) * 0.08)
    mesh.setColorAt(i, c)
  })
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  return { mesh, dispose: () => { geo.dispose(); mat.dispose() }, mat, count: placed.length }
}

/** Builds the city for an era. The ground around it is tinted elsewhere. */
export function buildCity(ctx: Ctx, era: Era): City {
  const group = new Group()
  const disposers: (() => void)[] = []
  const materials: City['materials'] = []

  const lm = new LineBasicMaterial({ color: 0xffb21a, transparent: true })
  materials.push(lm)
  const loopPts: number[] = []
  for (const [lon, lat] of era.outline) {
    const [x, z] = toKm(lon, lat)
    loopPts.push(x, yAt(ctx, lon, lat) + 0.006, z)
  }
  const loopGeo = new BufferGeometry()
  loopGeo.setAttribute('position', new Float32BufferAttribute(loopPts, 3))
  group.add(new LineLoop(loopGeo, lm))
  disposers.push(() => { loopGeo.dispose(); lm.dispose() })

  // Earlier footprints stay on the ground as faint outlines, so the growth shows.
  for (const prior of ERAS) {
    if (prior.id === era.id) break
    if (era.id === 'today' && prior.id !== 'jesus') continue
    const pts: number[] = []
    for (const [lon, lat] of prior.outline) { const [x, z] = toKm(lon, lat); pts.push(x, yAt(ctx, lon, lat) + 0.01, z) }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(pts, 3))
    const m = new LineBasicMaterial({ color: ERA_LINE[prior.id] ?? 0xffffff, transparent: true, opacity: 0.7 })
    group.add(new LineLoop(g, m))
    disposers.push(() => { g.dispose(); m.dispose() })
  }

  const w = wall(ctx, era.outline, WALL_HEIGHT[era.id], era.id === 'today' ? 0xd8c9a4 : 0xc8b690)
  materials.push(w.material as MeshLambertMaterial)
  group.add(w)
  disposers.push(() => { w.geometry.dispose(); (w.material as MeshLambertMaterial).dispose() })

  const palette = era.id === 'today' ? STONE : era.id === 'jesus' ? [...STONE, ...TILE] : STONE
  const seed = era.id.length * 7919 + 13
  const avoidMount = era.id === 'david' ? [] : [templeMount()]
  const core = houses(ctx, era.outline, Math.round(Math.min(era.hectares, era.id === 'today' ? 90 : era.hectares) * era.density), era, seed, 1, palette, avoidMount)
  group.add(core.mesh)
  materials.push(core.mat)
  disposers.push(core.dispose)

  if (era.sprawl) {
    const s = houses(ctx, SPRAWL, 20000, era, seed + 1, 1.1, MODERN, [era.outline])
    group.add(s.mesh)
    materials.push(s.mat)
    disposers.push(s.dispose)
  }

  const lmMats: MeshLambertMaterial[] = []
  for (const l of era.landmarks) group.add(landmark(ctx, l, lmMats))
  materials.push(...lmMats)
  disposers.push(() => { for (const m of lmMats) m.dispose() })
  group.traverse((o) => { if (o instanceof Mesh && !(o instanceof InstancedMesh)) disposers.push(() => o.geometry.dispose()) })

  return {
    group,
    materials,
    dispose: () => disposers.forEach((d) => d()),
  }
}

/** The Haram platform, kept clear of houses. */
function templeMount(): LonLat[] {
  return [[35.2338, 31.7765], [35.2372, 31.7762], [35.2374, 31.7805], [35.2342, 31.7806]]
}

export { FEATURES }
