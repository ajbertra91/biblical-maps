import type { CSSProperties } from 'react'
import { LAND } from './data/geo'
import { distanceKm, project, through, type Pt } from './data/geo-utils'
import { FAMILIES, PLACES, type Family } from './data/places'

/** Straight-line length of the route. A stop off the route has no leg. */
const routeKm = (f: Family) => {
  const on = f.stops.filter((s) => !s.offRoute).map((s) => PLACES[s.place])
  return on.slice(1).reduce((km, p, i) => km + distanceKm(on[i], p), 0)
}

/** A small static sketch of the family's stops on the base map. */
function Sketch({ family }: { family: Family }) {
  const pts: Pt[] = family.stops.map((s) => project(PLACES[s.place].lat, PLACES[s.place].lon))
  const route = family.stops.flatMap((s, i) => (s.offRoute ? [] : [pts[i]]))
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  // Fit the stops in a 16:10 box with a margin.
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2
  const w = Math.max(Math.max(...xs) - Math.min(...xs), ((Math.max(...ys) - Math.min(...ys)) * 16) / 10, 60) * 1.35
  const h = (w * 10) / 16
  const k = w / 320 // map units per sketch pixel
  return (
    <svg className="sketch" viewBox={`${cx - w / 2} ${cy - h / 2} ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ '--k': k } as CSSProperties}>
      <use href="#landing-land" className="land" />
      {family.route !== false && route.length > 1 && <path className="route" d={through(route)} />}
      {pts.map((p, i) => <circle key={i} className="pin" cx={p[0]} cy={p[1]} />)}
    </svg>
  )
}

export function Landing() {
  return (
    <main className="landing">
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs><path id="landing-land" d={LAND} /></defs>
      </svg>
      <header className="landing-bar">
        <span className="mark">Biblical Maps</span>
      </header>
      <section className="landing-intro">
        <h1>Choose a map</h1>
        <p>Each map follows one story across the land. Scroll to move from place to place. Every stop cites Scripture.</p>
      </section>
      <ul className="choices" aria-label="Maps">
        {FAMILIES.map((f) => (
          <li key={f.id}>
            <a className="choice" href={`#/${f.id}`} data-f={f.id}>
              <Sketch family={f} />
              <span className="choice-body">
                <span className="choice-name"><i aria-hidden="true" />{f.name}</span>
                <span className="choice-sub">{f.sub}</span>
                <span className="choice-data num">
                  {f.route === false ? `${f.stops.length} ${f.terms?.many ?? 'battles'}` : `${f.stops.length} stops · ≈${Math.round(routeKm(f))} km`}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <footer className="landing-foot">
        Base map: Natural Earth, public domain. Site coordinates: Wikidata. Routes are schematic.
      </footer>
    </main>
  )
}
