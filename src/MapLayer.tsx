import { memo, type RefObject } from 'react'
import { GEO_BOUNDS, GEO_H, GEO_W, LAKES, LAND, RIVERS } from './data/geo'
import { leg, paddedHull, project, through, type Pt } from './data/geo-utils'
import { PLACES, type Family } from './data/places'

const REGIONS: { t: string; lat: number; lon: number; rot?: number; start?: boolean; level: 'wide' | 'mid' | 'close'; water?: boolean }[] = [
  { t: 'EGYPT', lat: 29.9, lon: 30.5, level: 'wide' },
  { t: 'SINAI', lat: 29.0, lon: 33.7, level: 'wide' },
  { t: 'CANAAN', lat: 32.1, lon: 35.0, rot: -90, level: 'wide' },
  { t: 'MOAB', lat: 31.3, lon: 36.1, level: 'wide' },
  { t: 'EDOM', lat: 30.2, lon: 35.7, level: 'wide' },
  { t: 'Mediterranean Sea', lat: 33.6, lon: 33.0, level: 'wide', water: true },
  { t: 'SHINAR', lat: 32.9, lon: 45.3, level: 'wide' },
  { t: 'ELAM', lat: 32.6, lon: 47.9, level: 'wide' },
  { t: 'ARAM-NAHARAIM', lat: 36.25, lon: 40.6, level: 'wide' },
  { t: 'Euphrates', lat: 34.45, lon: 41.75, rot: 29, level: 'wide', water: true },
  { t: 'Tigris', lat: 35.0, lon: 44.0, rot: 68, level: 'wide', water: true },
  { t: 'Persian Gulf', lat: 29.25, lon: 48.75, level: 'wide', water: true },
  { t: 'Dead Sea', lat: 31.45, lon: 35.66, start: true, level: 'mid', water: true },
  { t: 'Sea of Galilee', lat: 32.8, lon: 35.7, start: true, level: 'mid', water: true },
]

// Reference cities that are not stops. Each cites Scripture.
const LANDMARKS = [
  { t: 'Babylon', lat: 32.5425, lon: 44.4211, ref: 'Gen 10:10; 11:1–9', note: 'Babel, in the land of Shinar' },
]

const GRATICULE = (() => {
  let d = ''
  for (let lon = Math.ceil(GEO_BOUNDS.lon0); lon <= GEO_BOUNDS.lon1; lon++) d += `M${project(GEO_BOUNDS.lat1, lon)[0].toFixed(1)} 0V${GEO_H}`
  for (let lat = Math.ceil(GEO_BOUNDS.lat0); lat <= GEO_BOUNDS.lat1; lat++) d += `M0 ${project(lat, GEO_BOUNDS.lon0)[1].toFixed(1)}H${GEO_W}`
  return d
})()

interface Node {
  p: Pt
  leg: number
}

interface Props {
  family: Family
  active: number
  svgRef: RefObject<SVGSVGElement | null>
  onPick: (stopIndex: number) => void
  /** Place id under the pointer or keyboard focus, or null. */
  onHover: (placeId: string | null) => void
}

export const MapLayer = memo(function MapLayer({ family, active, svgRef, onPick, onHover }: Props) {
  const stops = family.stops
  const pts = stops.map((s) => project(PLACES[s.place].lat, PLACES[s.place].lon))

  // Route nodes include unlabeled bend points. Each node tracks the leg it starts.
  const nodes: Node[] = []
  stops.forEach((s, i) => {
    if (s.offRoute) return
    nodes.push({ p: pts[i], leg: i })
    ;(family.bends?.[i] ?? []).forEach((b) => nodes.push({ p: project(b[0], b[1]), leg: i }))
  })
  const legs = nodes.slice(0, -1).map((n, k) => {
    const same = nodes.filter((m) => m.leg === n.leg)
    const sub = same.indexOf(n)
    const p0 = nodes[k - 1]?.p ?? n.p
    const p3 = nodes[k + 2]?.p ?? nodes[k + 1].p
    return { d: leg(p0, n.p, nodes[k + 1].p, p3), leg: n.leg, sub, count: same.length }
  })

  const first: Record<string, number> = {}
  stops.forEach((s, i) => { if (first[s.place] === undefined) first[s.place] = i })

  const place = (id: string) => PLACES[id]
  const activePlace = active > 0 ? stops[active - 1] : undefined
  const ap = activePlace ? project(place(activePlace.place).lat, place(activePlace.place).lon) : null

  return (
    <svg
      ref={svgRef}
      className="map"
      viewBox={`0 0 ${GEO_W} ${GEO_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Map of ${family.name.toLowerCase()} stops from Egypt to Mesopotamia`}
    >
      <rect className="sea" x="-500" y="-500" width={GEO_W + 1000} height={GEO_H + 1000} />
      <path className="shore" d={LAND} />
      <path className="land" d={LAND} />
      <path className="lake" d={LAKES} />
      <path className="river" d={RIVERS} />
      <path className="graticule" d={GRATICULE} />

      <g className="regions">
        {REGIONS.map((r) => {
          const [x, y] = project(r.lat, r.lon)
          return (
            <text key={r.t} className={`region lv-${r.level}${r.water ? ' water' : ''}`} x={x} y={y} textAnchor={r.start ? "start" : "middle"} transform={r.rot ? `rotate(${r.rot} ${x} ${y})` : undefined}>
              {r.t}
            </text>
          )
        })}
      </g>

      <g className="landmarks">
        {LANDMARKS.map((l) => {
          const [x, y] = project(l.lat, l.lon)
          return (
            <g key={l.t} className="landmark" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <title>{`${l.note} · ${l.ref}`}</title>
              <rect className="mark" x="-1" y="-1" width="2" height="2" />
              <text className="label" x="1" y="0">{l.t}</text>
            </g>
          )
        })}
      </g>

      {family.zones?.map((z) => {
        const h = paddedHull(z.places.map((id) => project(place(id).lat, place(id).lon)), z.radius)
        const idx = Math.min(...z.places.map((id) => first[id]))
        return (
          <polygon key={z.id} className="zone" style={{ ['--z' as string]: `var(--r${idx})` }} points={h.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ')}>
            <title>{`${z.name} · ${z.ref}`}</title>
          </polygon>
        )
      })}

      {family.giants?.map((g) => {
        const pts = g.places.map((id) => project(place(id).lat, place(id).lon))
        const h = paddedHull(pts, g.radius)
        const top = Math.min(...h.map((q) => q[1]))
        const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length
        return (
          <g key={g.id} className={`giant g-${g.id}`}>
            <polygon points={h.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ')}>
              <title>{`${g.name} · ${g.ref}${g.note ? `. ${g.note}` : ''}`}</title>
            </polygon>
            <text x={cx.toFixed(1)} y={top.toFixed(1)} textAnchor="middle">{g.name}</text>
          </g>
        )
      })}

      <g className={`routes f-${family.id}`}>
        {family.route !== false && legs.map((l, i) => (
          <g key={i} style={{ ['--p' as string]: `clamp(0, var(--l${l.leg}) * ${l.count} - ${l.sub}, 1)` }}>
            <path className="casing" d={l.d} pathLength={1} />
            <path className="route" d={l.d} pathLength={1} />
          </g>
        ))}
      </g>

      {activePlace?.moves && (
        // Army movements of the current stop. They draw in as the camera arrives.
        <g className="moves" key={`moves-${active}`} style={{ ['--p' as string]: `var(--r${active - 1})` }}>
          {activePlace.moves.map((m, j) => {
            const mp = m.path.map((id) => project(place(id).lat, place(id).lon))
            const [a, b] = mp.slice(-2)
            const deg = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
            const k = Math.floor((mp.length - 1) / 2)
            const mid = [(mp[k][0] + mp[k + 1][0]) / 2, (mp[k][1] + mp[k + 1][1]) / 2]
            return (
              <g key={j} className={`move m-${m.force}`}>
                <title>{`${m.label}: ${m.path.map((id) => place(id).name).join(' to ')} · ${m.ref}`}</title>
                <path className="casing" d={through(mp)} pathLength={1} />
                <path className="line" d={through(mp)} pathLength={1} />
                <g transform={`translate(${b[0].toFixed(1)} ${b[1].toFixed(1)}) rotate(${deg.toFixed(1)})`}>
                  <path className="head" d="M-1.6 -1L0 0L-1.6 1Z" />
                </g>
                <text x={mid[0].toFixed(1)} y={mid[1].toFixed(1)} textAnchor="middle">{m.label}</text>
              </g>
            )
          })}
          {[...new Set(activePlace.moves.flatMap((m) => m.path))].filter((id) => first[id] === undefined).map((id) => {
            const [x, y] = project(place(id).lat, place(id).lon)
            return (
              <g key={id} className="waypoint" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <rect className="mark" x="-1" y="-1" width="2" height="2" />
                <text className="label" x="1" y="0">{place(id).name}</text>
              </g>
            )
          })}
        </g>
      )}

      <g className={`places f-${family.id}`}>
        {Object.entries(first).map(([id, i]) => {
          const p = place(id)
          const [x, y] = project(p.lat, p.lon)
          const refs = stops.filter((s) => s.place === id).map((s) => s.ref).join('; ')
          return (
            <g
              key={id}
              className={`place${p.schematic ? ' schematic' : ''}`}
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
              style={{ ['--r' as string]: `var(--r${i})` }}
              tabIndex={0}
              role="button"
              aria-label={`${p.name}, ${refs}. Go to stop ${i + 1}.`}
              onClick={() => onPick(i + 1)}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') onHover(id) }}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(id)}
              onBlur={() => onHover(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(i + 1) } }}
            >
              <circle className="hit" r="1" />
              <circle className="pin" r="1" />
              <text className={`label${p.labelLeft ? ' left' : ''}`} x={p.labelLeft ? -1 : 1} y="0">{p.name}</text>
            </g>
          )
        })}
      </g>

      {ap && (
        <g className="reticle" transform={`translate(${ap[0].toFixed(1)} ${ap[1].toFixed(1)})`} key={active}>
          <circle className="ring" r="1" />
          <path className="cross" d="M-2 0H-1M1 0H2M0 -2V-1M0 1V2" />
        </g>
      )}
    </svg>
  )
})
