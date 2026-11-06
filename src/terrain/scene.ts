import {
  AmbientLight, BufferAttribute, BufferGeometry, Color, DirectionalLight, Float32BufferAttribute, Fog, Group,
  HemisphereLight, Mesh, MeshLambertMaterial, PerspectiveCamera, PlaneGeometry, Scene, Vector3, WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ERAS, FEATURES, LAND_LABELS, SEA_LABELS, eraById, type Era, type EraId } from '../data/jerusalem'
import { buildCity, SPRAWL, type City } from './city'
import { shade } from './colors'
import { Heightfield, pointInPolygon, toKm, type Meta } from './heightfield'

export type View = 'land' | 'city' | 'mount'

export interface Label { text: string; kind: 'city' | 'region' | 'sea' | 'hill' | 'valley' | 'spring' | 'site'; scope: 'land' | 'city'; size: number }
export interface SceneApi {
  setEra(id: EraId): void
  setExaggeration(v: number): void
  fly(view: View, instant?: boolean): void
  /** Called each frame with the screen position of each label. */
  onLabels(cb: (items: { label: Label; x: number; y: number; visible: boolean }[]) => void): void
  dispose(): void
}

const SEA = 0x071a22
const SEA_EDGE = new Color(0x0f3a52)
const VALLEY = new Color(0x5f7f4a)
const URBAN_ANCIENT = new Color(0xd9893f)
const URBAN_MODERN = new Color(0xa9a7a2)

export async function loadHeightfield(name: string, base: string): Promise<Heightfield> {
  const [meta, bin] = await Promise.all([
    fetch(`${base}terrain/${name}.json`).then((r) => r.json() as Promise<Meta>),
    fetch(`${base}terrain/${name}.bin`).then((r) => r.arrayBuffer()),
  ])
  return new Heightfield(meta, new Int16Array(bin))
}

function terrainMesh(hf: Heightfield, step: number, hole?: Heightfield, relief = 0, fadeEdge = 0) {
  const { w, h } = hf.meta
  const cols = Math.ceil((w - 1) / step) + 1, rows = Math.ceil((h - 1) / step) + 1
  const pos = new Float32Array(cols * rows * 3)
  const col = new Float32Array(cols * rows * 3)
  const c = new Color()
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const gx = Math.min(w - 1, q * step), gy = Math.min(h - 1, r * step)
    const lon = hf.lonAt(gx), lat = hf.latAt(gy)
    const s = shade(lon, lat, hf.data[gy * w + gx], c)
    if (relief && s.surface === 'land') {
      // Valleys darken and ridges lighten, so the shape of the ground reads before the sun does.
      const rr = 6
      const around = (hf.data[gy * w + Math.max(0, gx - rr)] + hf.data[gy * w + Math.min(w - 1, gx + rr)] + hf.data[Math.max(0, gy - rr) * w + gx] + hf.data[Math.min(h - 1, gy + rr) * w + gx]) / 4
      const bump = Math.max(-1, Math.min(1, (hf.data[gy * w + gx] - around) / 25))
      if (bump < 0) s.color.lerp(VALLEY, -bump * 0.45)
      s.color.multiplyScalar(1 + bump * relief * 0.8)
    }
    if (fadeEdge) {
      // The data ends in a straight cut. Let the land sink into the sea there.
      const d = Math.min(q, r, cols - 1 - q, rows - 1 - r)
      const f = Math.min(1, d / fadeEdge)
      const k = f * f * (3 - 2 * f)
      s.y = s.y * k + -150 * (1 - k)
      s.color.lerp(SEA_EDGE, 1 - k)
    }
    const [x, z] = toKm(lon, lat)
    const i = (r * cols + q) * 3
    pos[i] = x; pos[i + 1] = s.y / 1000; pos[i + 2] = z
    col[i] = s.color.r; col[i + 1] = s.color.g; col[i + 2] = s.color.b
  }
  const idx: number[] = []
  for (let r = 0; r < rows - 1; r++) for (let q = 0; q < cols - 1; q++) {
    if (hole) {
      // Leave a gap where the detailed map sits, a little inside its edge.
      const lon = hf.lonAt(Math.min(w - 1, (q + 0.5) * step)), lat = hf.latAt(Math.min(h - 1, (r + 0.5) * step))
      const m = hole.meta, pad = 0.0006
      if (lon > m.lon0 + pad && lon < m.lon1 - pad && lat > m.lat0 + pad && lat < m.lat1 - pad) continue
    }
    const a = r * cols + q, b = a + 1, d = a + cols, e = d + 1
    idx.push(a, d, b, b, d, e)
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(pos, 3))
  g.setAttribute('color', new BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return { geometry: g, cols, rows, step }
}

export function createScene(container: HTMLElement, land: Heightfield, jer: Heightfield): SceneApi {
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  container.appendChild(renderer.domElement)
  renderer.domElement.style.display = 'block'

  const scene = new Scene()
  scene.background = new Color(SEA)
  const fog = new Fog(SEA, 10, 100)
  scene.fog = fog
  const camera = new PerspectiveCamera(50, 1, 0.01, 1500)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.maxPolarAngle = Math.PI * 0.48
  controls.minDistance = 0.12
  controls.maxDistance = 700
  controls.screenSpacePanning = false
  controls.listenToKeyEvents(window)
  controls.keyPanSpeed = 14

  scene.add(new AmbientLight(0xffffff, 0.34))
  scene.add(new HemisphereLight(0xcfe0ff, 0x5a4a34, 0.6))
  // Low sun from the north-west, so ridges and valleys throw shade.
  const sun = new DirectionalLight(0xfff4e0, 3.4)
  sun.position.set(-1, 0.5, -0.7)
  scene.add(sun)

  // Terrain: the whole land at about 200 m, with Jerusalem cut in at about 30 m.
  const terrain = new Group()
  const mat = new MeshLambertMaterial({ vertexColors: true })
  // Contour lines every 20 m on the detailed map, drawn in the shader so they stay sharp at any zoom.
  const jerMat = new MeshLambertMaterial({ vertexColors: true })
  jerMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vElev;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvElev = position.y * 1000.0;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vElev;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float cl = abs(fract(vElev / 20.0) - 0.5) * 2.0;
        float cm = abs(fract(vElev / 100.0) - 0.5) * 2.0;
        float w1 = clamp(fwidth(vElev / 20.0) * 2.0, 0.06, 0.5);
        float w2 = clamp(fwidth(vElev / 100.0) * 2.0, 0.04, 0.5);
        float line = smoothstep(1.0 - w1, 1.0, cl);
        float major = smoothstep(1.0 - w2, 1.0, cm);
        diffuseColor.rgb *= 1.0 - 0.22 * line - 0.2 * major;`)
  }
  const a = terrainMesh(land, 3, jer, 0, 14)
  const b = terrainMesh(jer, 2, undefined, 0.5)
  terrain.add(new Mesh(a.geometry, mat), new Mesh(b.geometry, jerMat))
  scene.add(terrain)
  // A flat sea reaches the horizon past the data.
  const ocean = new Mesh(new PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2), new MeshLambertMaterial({ color: 0x0f3a52 }))
  ocean.position.set(0, -0.35, 0)
  scene.add(ocean)

  let exag = 2.5
  terrain.scale.y = exag

  // Tint the ground inside the city so its size reads from above.
  const jerColor = b.geometry.getAttribute('color') as Float32BufferAttribute
  const baseColor = jerColor.array.slice() as Float32Array
  const maskCache = new Map<EraId, Uint8Array>()
  const maskFor = (era: Era) => {
    let m = maskCache.get(era.id)
    if (m) return m
    const { cols, rows } = b
    m = new Uint8Array(cols * rows)
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const lon = jer.lonAt(Math.min(jer.meta.w - 1, q * b.step)), lat = jer.latAt(Math.min(jer.meta.h - 1, r * b.step))
      m[r * cols + q] = pointInPolygon(lon, lat, era.outline) ? 2 : era.sprawl && pointInPolygon(lon, lat, SPRAWL) ? 1 : 0
    }
    maskCache.set(era.id, m)
    return m
  }
  const tint = (era: Era) => {
    const m = maskFor(era)
    const arr = jerColor.array as Float32Array
    arr.set(baseColor)
    const t = new Color()
    for (let i = 0; i < m.length; i++) {
      if (!m[i]) continue
      const urban = era.id === 'today' ? URBAN_MODERN : URBAN_ANCIENT
      t.setRGB(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]).lerp(urban, m[i] === 2 ? 0.7 : 0.45)
      arr[i * 3] = t.r; arr[i * 3 + 1] = t.g; arr[i * 3 + 2] = t.b
    }
    jerColor.needsUpdate = true
  }

  // City.
  let city: City | null = null
  let fade = 1
  let eraId: EraId = 'solomon'
  const rebuild = () => {
    if (city) { scene.remove(city.group); city.dispose() }
    const era = eraById(eraId)
    city = buildCity({ hf: jer, exag }, era)
    scene.add(city.group)
    tint(era)
    fade = 0
  }
  rebuild()

  // Labels.
  const labels: { label: Label; pos: Vector3; lonlat: [number, number]; src: Heightfield }[] = []
  const place = (l: Label, lon: number, lat: number) => {
    const src = jer.contains(lon, lat) ? jer : land
    const [x, z] = toKm(lon, lat)
    labels.push({ label: l, pos: new Vector3(x, 0, z), lonlat: [lon, lat], src })
  }
  for (const l of LAND_LABELS) place({ text: l.name, kind: l.size === 3 ? 'city' : 'region', scope: 'land', size: l.size }, ...l.at)
  for (const l of SEA_LABELS) place({ text: l.name, kind: 'sea', scope: 'land', size: 1 }, ...l.at)
  for (const f of FEATURES) place({ text: f.name, kind: f.kind, scope: 'city', size: 1 }, ...f.at)
  const siteLabels = () => eraById(eraId).landmarks
  const heightOf = (l: (typeof labels)[number]) => {
    const e = shade(l.lonlat[0], l.lonlat[1], l.src.elevAt(...l.lonlat)).y
    return (Math.max(e, 0) / 1000) * exag
  }

  let cb: Parameters<SceneApi['onLabels']>[0] | null = null
  const v = new Vector3()

  // Camera moves.
  // Jerusalem stands about 740 m above the sea, so city views are placed relative to the ground there.
  const ground = () => (jer.elevAt(35.2354, 31.778) * exag) / 1000
  // How far back the camera sits for each era, in km. The modern city needs the whole basin in view.
  const CITY_DIST: Record<EraId, number> = { david: 0.75, solomon: 1.05, exile: 1.05, jesus: 2.0, today: 6.5 }
  let flight: { t: number; p0: Vector3; t0: Vector3; p1: Vector3; t1: Vector3; dur: number } | null = null
  const target = (view: View) => {
    if (view === 'land') return { pos: new Vector3(-15, 230, 330), tgt: new Vector3(-22, 0, 25) }
    const g = ground()
    if (view === 'mount') return { pos: new Vector3(0.35, g + 0.3, 0.55), tgt: new Vector3(0, g, 0) }
    const era = eraById(eraId)
    const [cx, cz] = era.id === 'today' ? [-0.4, 0.4] : era.id === 'jesus' ? [-0.3, 0.1] : era.id === 'david' ? [0.1, 0.4] : [0, 0.1]
    const d = CITY_DIST[era.id]
    return { pos: new Vector3(cx + d * 0.2, g + d * 0.6, cz + d * 0.8), tgt: new Vector3(cx, g, cz) }
  }
  let currentView: View = 'city'
  const fly = (view: View, instant = false) => {
    currentView = view
    if (instant) flight = null
    const { pos: p1, tgt: t1 } = target(view)
    if (instant) { camera.position.copy(p1); controls.target.copy(t1); controls.update(); return }
    const dist = camera.position.distanceTo(p1)
    flight = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1, t1, dur: Math.min(3.2, 1 + Math.log10(1 + dist) * 0.6) }
  }
  fly('city', true)
  controls.addEventListener('start', () => { flight = null })

  const resize = () => {
    const w = container.clientWidth || 1, h = container.clientHeight || 1
    renderer.setSize(w, h)
    camera.aspect = w / h
    // Keep the middle of the picture clear of the side panel on wide screens.
    if (w > 900) camera.setViewOffset(w, h, -170, 0, w, h)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  let last = performance.now()
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    if (flight) {
      flight.t += dt / flight.dur
      const k = Math.min(1, flight.t)
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
      camera.position.lerpVectors(flight.p0, flight.p1, e)
      controls.target.lerpVectors(flight.t0, flight.t1, e)
      if (k >= 1) flight = null
    }
    controls.update()
    const dist = camera.position.distanceTo(controls.target)
    // Keep depth precision: the near plane follows the camera out.
    const near = Math.max(0.01, dist * 0.012)
    if (Math.abs(near - camera.near) / camera.near > 0.05) { camera.near = near; camera.updateProjectionMatrix() }
    fog.near = dist * 2
    fog.far = dist * 9 + 4
    if (fade < 1 && city) {
      fade = Math.min(1, fade + dt / 0.7)
      for (const m of city.materials) {
        const t = fade < 1
        if (m.transparent !== t) (m as unknown as { needsUpdate: boolean }).needsUpdate = true
        m.transparent = t
        m.opacity = fade
      }
    }
    renderer.render(scene, camera)

    if (cb) {
      const w = container.clientWidth, h = container.clientHeight
      const items = labels.map((l) => {
        v.set(l.pos.x, heightOf(l) + 0.02, l.pos.z)
        const d = camera.position.distanceTo(v)
        v.project(camera)
        const onScreen = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05
        const near = dist < 7
        const visible = onScreen && (l.label.scope === 'city' ? near && d < 6 : near ? l.label.kind === 'city' && dist > 3 : l.label.size >= 2 || dist < 150)
        return { label: l.label, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, visible }
      })
      if (dist < 7) {
        for (const lm of siteLabels()) {
          const [x, z] = toKm(...lm.at)
          const y = (jer.elevAt(...lm.at) / 1000) * exag + 0.04
          v.set(x, y, z).project(camera)
          items.push({ label: { text: lm.name, kind: 'site', scope: 'city', size: 2 }, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, visible: v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 })
        }
      }
      cb(items)
    }
  })

  return {
    setEra(id) { eraId = id; rebuild(); if (currentView === 'city') fly('city') },
    setExaggeration(x) { exag = x; terrain.scale.y = x; rebuild() },
    fly: (view, instant) => fly(view, instant),
    onLabels(f) { cb = f },
    dispose() {
      renderer.setAnimationLoop(null)
      ro.disconnect()
      controls.dispose()
      city?.dispose()
      a.geometry.dispose(); b.geometry.dispose(); mat.dispose(); jerMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}

export { ERAS }
