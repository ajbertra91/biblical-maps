import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapLayer } from './MapLayer'
import { PhotoViewer } from './PhotoViewer'
import { centerOf, type Key } from './camera'
import { FAMILIES, FORCES, PLACES, familyById, type Confidence, type FamilyId, type Stop } from './data/places'
import { PHOTOS } from './data/photos'
import { distanceKm, project, type Pt } from './data/geo-utils'
import { useScrollCamera } from './useScrollCamera'

const CONFIDENCE: Record<Confidence, string> = {
  identified: 'Site identified',
  traditional: 'Traditional site',
  debated: 'Site debated',
}

const pad = (n: number) => String(n).padStart(2, '0')
/** Last stop before index i that is on the route. */
const routeStopBefore = (stops: Stop[], i: number) => stops.slice(0, i).reverse().find((s) => !s.offRoute)
const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function App() {
  const [familyId, setFamilyId] = useState<FamilyId>('military')
  const family = familyById(familyId)
  const stops = family.stops
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const readout = useRef<HTMLDivElement>(null)
  const cite = useRef<HTMLDivElement>(null)
  const citeAt = useRef<{ p: Pt; hover: boolean } | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  // The place whose photos are open. It stays fixed if the camera moves on behind the viewer.
  const [photosFor, setPhotosFor] = useState<string | null>(null)
  const closePhotos = useCallback(() => setPhotosFor(null), [])

  const keys = useMemo<Key[]>(() => {
    const at = (id: string) => project(PLACES[id].lat, PLACES[id].lon)
    const pts: Pt[] = stops.map((s) => at(s.place))
    const bends = Object.values(family.bends ?? {}).flat().map((b) => project(b[0], b[1]))
    const fit = [...pts, ...bends]
    const [cx, cy] = centerOf(fit)
    // A stop with army movements frames the whole of each movement.
    return [{ x: cx, y: cy, fit, pad: 1.3 }, ...stops.map((s, i): Key => {
      if (!s.moves) return { x: pts[i][0], y: pts[i][1], s: s.span ?? 120 }
      const f = [pts[i], ...s.moves.flatMap((m) => m.path.map(at))]
      const [x, y] = centerOf(f)
      return { x, y, fit: f, s: s.span }
    })]
  }, [family, stops])

  const { chapter, requestDraw } = useScrollCamera({ keys, stopCount: stops.length, svgRef, stageRef, readout, cite, citeAt })

  // Real straight-line distances between stops. Both ends need coordinates.
  // A stop off the route has no leg. The next leg starts at the last stop on the route.
  const legKm = useMemo(
    () => stops.map((s, i) => {
      const prev = routeStopBefore(stops, i)
      return !prev || s.offRoute ? 0 : distanceKm(PLACES[prev.place], PLACES[s.place])
    }),
    [stops],
  )
  const totalKm = legKm.reduce((a, b) => a + b, 0)
  const hasRoute = family.route !== false
  const forces = [...new Set(stops.flatMap((s) => s.moves?.map((m) => m.force) ?? []))]

  const goTo = useCallback(
    (ch: number) => {
      const room = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: (ch / stops.length) * room, behavior: prefersReduced() ? 'auto' : 'smooth' })
    },
    [stops.length],
  )

  const pick = (id: FamilyId) => {
    if (id === familyId) return
    window.scrollTo(0, 0)
    setHover(null)
    setFamilyId(id)
  }

  // Arrow keys step through the stops when no control has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName)) return
      if (e.target instanceof HTMLElement && e.target.closest('dialog')) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(Math.min(stops.length, chapter + 1)) }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(Math.max(0, chapter - 1)) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapter, goTo, stops.length])

  // The stop list scrolls on its own. Keep the current stop in the middle of it.
  const listRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const list = listRef.current
    const item = list?.children[Math.max(0, chapter - 1)] as HTMLElement | undefined
    if (!list || !item) return
    const top = item.offsetTop - (list.clientHeight - item.offsetHeight) / 2
    list.scrollTo?.({ top: chapter === 0 ? 0 : top, behavior: prefersReduced() ? 'auto' : 'smooth' })
  }, [chapter, familyId])

  const stop = chapter > 0 ? stops[chapter - 1] : undefined
  const place = stop ? PLACES[stop.place] : undefined
  const photos = stop ? PHOTOS[stop.place] : undefined

  // The pop-up shows the hovered place, or else the current stop. It lists every reference for that place.
  const citeId = hover ?? stop?.place
  const citeStops = citeId ? stops.map((s, i) => ({ ...s, i })).filter((s) => s.place === citeId) : []
  useEffect(() => {
    const p = citeId ? PLACES[citeId] : undefined
    citeAt.current = p ? { p: project(p.lat, p.lon), hover: hover !== null } : null
    requestDraw()
  }, [citeId, hover, requestDraw])

  return (
    <>
      <div className="stage" ref={stageRef} data-family={family.id} data-level="wide">
        <MapLayer family={family} active={chapter} svgRef={svgRef} onPick={goTo} onHover={setHover} />
        <div className="cite" ref={cite} aria-hidden="true">
          {citeId && (
            <div className="cite-box">
              <b>{PLACES[citeId].name}</b>
              {citeStops.map((s) => (
                <span key={s.i} data-current={s.i === chapter - 1}>{s.ref}</span>
              ))}
            </div>
          )}
        </div>
        <div className="haze haze-a" aria-hidden="true" />
        <div className="haze haze-b" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="frame" aria-hidden="true"><i /><i /><i /><i /></div>

        <header className="bar">
          <span className="mark">Biblical Maps</span>
          <div className="tabs" role="group" aria-label="Map family">
            {FAMILIES.map((f) => (
              <button key={f.id} data-f={f.id} aria-pressed={f.id === familyId} onClick={() => pick(f.id)}>
                <i aria-hidden="true" />
                {f.name}
              </button>
            ))}
          </div>
          <details className="sources">
            <summary>Sources</summary>
            <div className="sources-body">
              <p><b>Base map</b> Natural Earth 1:10m land, lakes and rivers. Public domain.</p>
              <p><b>Sites</b> Coordinates come from Wikidata. Many biblical sites are debated, so each stop shows how sure the identification is.</p>
              <p><b>Routes</b> Lines join stops in order. The paths between stops are schematic.</p>
              <p><b>Armies</b> Arrows join places that the text names for a movement. Each arrow cites its passage. The paths are schematic.</p>
              <p><b>Scripture</b> Each stop cites its passage. Check each reference in your own translation.</p>
            </div>
          </details>
        </header>

        <div className="hud hud-tr" ref={readout} aria-hidden="true">
          <div className="coords"><span className="k">Lat</span> <span className="v-lat" /><br /><span className="k">Lon</span> <span className="v-lon" /></div>
          <div className="scalebar"><i /><span className="v-bar" /></div>
        </div>

        <nav className="stops-rail" aria-label="Stop navigation">
          <button className="step" onClick={() => goTo(chapter - 1)} disabled={chapter === 0} aria-label="Previous stop">▲</button>
          <ol className="stops" ref={listRef} aria-label={`${family.name} stops`}>
            {stops.map((s, i) => (
              <li key={i}>
                <button onClick={() => goTo(i + 1)} aria-current={chapter === i + 1 ? 'step' : undefined} data-reached={chapter >= i + 1}>
                  <span className="n">{pad(i + 1)}</span>
                  <span className="t">{PLACES[s.place].name}</span>
                </button>
              </li>
            ))}
          </ol>
          <button className="step" onClick={() => goTo(chapter + 1)} disabled={chapter === stops.length} aria-label="Next stop">▼</button>
        </nav>

        <section className="panel" aria-live="polite" aria-atomic="true">
          {stop && place ? (
            <>
              <p className="meta">
                <span className="num">{pad(chapter)} / {pad(stops.length)}</span>
                <span className="tag" data-c={place.confidence}>{CONFIDENCE[place.confidence]}</span>
              </p>
              <h1 className="place-name">{place.name}</h1>
              <p className="event">{stop.event}</p>
              <p className="ref">
                <span>{stop.ref}</span>
                {photos && (
                  <button className="photos-open" onClick={() => setPhotosFor(stop.place)} aria-haspopup="dialog">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" /><circle cx="5.5" cy="6.5" r="1.3" /><path d="M2 12l4-4 3 3 2-2 3 3" /></svg>
                    Photos <span className="num">{photos.length}</span>
                  </button>
                )}
              </p>
              {stop.moves && (
                <ul className="moves-list" aria-label="Army movements">
                  {stop.moves.map((m, i) => (
                    <li key={i} data-force={m.force}>
                      <i aria-hidden="true" />
                      <span><b>{m.label}</b> {m.path.map((id) => PLACES[id].name).join(' → ')}</span>
                      <span className="num">{m.ref}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="data num">
                {place.schematic ? 'Location unknown' : `${place.lat.toFixed(3)}°N ${place.lon.toFixed(3)}°E`}
                {hasRoute && legKm[chapter - 1] > 0 && ` · ≈${Math.round(legKm[chapter - 1])} km from ${PLACES[routeStopBefore(stops, chapter - 1)!.place].name}`}
              </p>
              {stop.note && <p className="note">{stop.note}</p>}
              {place.note && <p className="note">{place.note}</p>}
            </>
          ) : (
            <>
              <p className="meta"><span className="num">00 / {pad(stops.length)}</span></p>
              <h1 className="place-name">{family.name}</h1>
              <p className="event">{family.sub}</p>
              <p className="data num">{hasRoute ? `${stops.length} stops · ≈${Math.round(totalKm)} km in straight lines` : `${stops.length} battles and campaigns`}</p>
              <p className="hint">{hasRoute ? 'Scroll to follow the route.' : 'Scroll to follow the battles.'}</p>
            </>
          )}
        </section>

        <ul className="key" aria-label="Map key">
          {hasRoute && <li><i className="k-route" />Route</li>}
          {forces.map((f) => <li key={f}><i className="k-move" data-force={f} />{FORCES[f]}</li>)}
          {family.zones && <li><i className="k-zone" />Campaign area</li>}
          {family.giants && <li><i className="k-giant" />{family.id === 'kings' ? 'Giants of Gath' : 'Rephaim peoples'}</li>}
          <li><i className="k-pin" />{hasRoute ? 'Stop' : 'Battle'}</li>
        </ul>
      </div>
      {photosFor && <PhotoViewer place={PLACES[photosFor].name} photos={PHOTOS[photosFor]} onClose={closePhotos} />}
      <div className="scroll-space" style={{ height: `calc(100svh + ${stops.length * 70}svh)` }} aria-hidden="true" />
    </>
  )
}

export default App
