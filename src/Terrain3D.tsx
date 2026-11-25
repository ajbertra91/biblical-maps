import { useEffect, useRef, useState } from 'react'
import { ERAS, eraById, type EraId } from './data/jerusalem'
import { FAMILIES } from './data/places'
import type { SceneApi, View } from './terrain/scene'

const fmt = (n: number) => n.toLocaleString('en-US')
const range = ([lo, hi]: [number, number]) => `${fmt(lo)}-${fmt(hi)}`
const acres = (ha: number) => `${fmt(ha)} ha`

const VIEWS: { id: View; name: string }[] = [
  { id: 'land', name: 'Whole land' },
  { id: 'city', name: 'Jerusalem' },
  { id: 'mount', name: 'Temple Mount' },
]

function Bars({ active }: { active: EraId }) {
  // Log scale, since the modern city is a hundred times the size of David's.
  const max = Math.log10(Math.max(...ERAS.map((e) => e.hectares)) * 1.2)
  const min = Math.log10(2)
  return (
    <ul className="t3-bars" aria-label="City area by era">
      {ERAS.map((e) => (
        <li key={e.id} data-active={e.id === active}>
          <span className="n">{e.name}</span>
          <span className="b"><i style={{ width: `${((Math.log10(e.hectares) - min) / (max - min)) * 100}%` }} /></span>
          <span className="v num">{acres(e.hectares)}</span>
        </li>
      ))}
    </ul>
  )
}

/** The era and view can be linked to as #/terrain?era=jesus&view=mount. */
const startParams = () => {
  const q = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const era = ERAS.find((e) => e.id === q.get('era'))?.id ?? 'solomon'
  const view = VIEWS.find((v) => v.id === q.get('view'))?.id ?? 'city'
  return { era, view }
}

export function Terrain3D() {
  const start = useRef(startParams()).current
  const host = useRef<HTMLDivElement>(null)
  const labelsEl = useRef<HTMLDivElement>(null)
  const api = useRef<SceneApi | null>(null)
  const [eraId, setEraId] = useState<EraId>(start.era)
  const [exag, setExag] = useState(2.5)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [view, setView] = useState<View>(start.view)
  // On a narrow screen the panel starts folded so the map stays visible.
  const [open, setOpen] = useState(() => window.innerWidth > 760)
  const eraRef = useRef(eraId)
  const exagRef = useRef(exag)
  eraRef.current = eraId
  exagRef.current = exag

  useEffect(() => {
    let dead = false
    let made: SceneApi | null = null
    ;(async () => {
      try {
        const probe = document.createElement('canvas')
        if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('WebGL unavailable')
        const { createScene, loadHeightfield } = await import('./terrain/scene')
        const base = import.meta.env.BASE_URL
        const [land, jer] = await Promise.all([loadHeightfield('land', base), loadHeightfield('jerusalem', base)])
        if (dead || !host.current) return
        const els = new Map<string, HTMLSpanElement>()
        made = createScene(host.current, land, jer)
        made.setExaggeration(exagRef.current)
        made.setEra(eraRef.current)
        if (start.view !== 'city') made.fly(start.view, true)
                made.onLabels((items) => {
          const root = labelsEl.current
          if (!root) return
          const W = root.clientWidth
          const rank: Record<string, number> = { city: 0, site: 1, hill: 2, spring: 3, valley: 4, sea: 5, region: 6 }
          const order = items.filter((i) => i.visible).sort((a, b) => rank[a.label.kind] - rank[b.label.kind] || b.label.size - a.label.size)
          // Keep the highest-ranked labels and drop any that would overlap one already placed.
          // Controls on top of the map are obstacles too.
          const placed: { x0: number; x1: number; y0: number; y1: number }[] = []
          const rootBox = root.getBoundingClientRect()
          for (const ui of document.querySelectorAll('.t3-panel, .t3-tools, .t3-eras, .t3-help, .t3 .bar')) {
            const r = ui.getBoundingClientRect()
            placed.push({ x0: r.left - rootBox.left - 6, x1: r.right - rootBox.left + 6, y0: r.top - rootBox.top - 6, y1: r.bottom - rootBox.top + 6 })
          }
          const shown = new Set<string>()
          for (const it of order) {
            const w = it.label.text.length * (it.label.kind === 'city' ? 13 : 7.6) + 8
            const h = it.label.kind === 'city' ? 24 : 16
            const box = { x0: it.x - w / 2, x1: it.x + w / 2, y0: it.y - h, y1: it.y }
            if (box.y0 < 84 || box.x0 < 0 || box.x1 > W) continue
            if (placed.some((p) => box.x0 < p.x1 && box.x1 > p.x0 && box.y0 < p.y1 && box.y1 > p.y0)) continue
            placed.push(box)
            shown.add(`${it.label.kind}:${it.label.text}`)
          }
          const seen = new Set<string>()
          for (const it of items) {
            const key = `${it.label.kind}:${it.label.text}`
            seen.add(key)
            let el = els.get(key)
            if (!el) {
              el = document.createElement('span')
              el.className = 't3-label'
              el.dataset.kind = it.label.kind
              el.textContent = it.label.text
              root.appendChild(el)
              els.set(key, el)
            }
            const on = shown.has(key)
            el.style.display = on ? '' : 'none'
            if (on) el.style.transform = `translate(${it.x.toFixed(0)}px, ${it.y.toFixed(0)}px) translate(-50%, -100%)`
          }
          for (const [k, el] of els) if (!seen.has(k)) { el.remove(); els.delete(k) }
        })
        api.current = made
        setStatus('ready')
      } catch {
        if (!dead) setStatus('error')
      }
    })()
    return () => { dead = true; made?.dispose(); api.current = null }
  }, [])

  useEffect(() => { api.current?.setEra(eraId) }, [eraId, status])
  useEffect(() => {
    const t = setTimeout(() => api.current?.setExaggeration(exag), 120)
    return () => clearTimeout(t)
  }, [exag, status])

  const era = eraById(eraId)
  const idx = ERAS.findIndex((e) => e.id === eraId)
  const go = (v: View) => { setView(v); api.current?.fly(v) }

  return (
    <div className="t3" data-status={status}>
      <div className="t3-canvas" ref={host} />
      <div className="t3-labels" ref={labelsEl} aria-hidden="true" />

      <header className="bar">
        <a className="home" href="#/">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5L4 6l3.5 3.5" /></svg>
          All maps
        </a>
        <span className="mark">Biblical Maps</span>
        <div className="tabs" role="group" aria-label="Map family">
          {FAMILIES.map((f) => (
            <a key={f.id} href={`#/${f.id}`} data-f={f.id}>
              <i aria-hidden="true" style={{ color: 'var(--ink-dim)' }} />
              {f.name}
            </a>
          ))}
          <a href="#/terrain" data-f="terrain" aria-current="page">
            <i aria-hidden="true" />
            3D Jerusalem
          </a>
        </div>
      </header>

      {status === 'loading' && <p className="t3-msg" role="status">Loading terrain…</p>}
      {status === 'error' && <p className="t3-msg" role="alert">The 3D map needs WebGL, which this browser cannot start.</p>}

      <section className="t3-panel" aria-live="polite" data-open={open}>
        <button className="t3-fold" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Hide details' : 'Show details'}>{open ? '−' : '+'}</button>
        <p className="meta"><span className="num">{String(idx + 1).padStart(2, '0')} / {String(ERAS.length).padStart(2, '0')}</span><span className="tag">{era.date}</span></p>
        <h1 className="place-name">{era.name}</h1>
        <p className="event">{era.blurb}</p>
        <dl className="t3-stats">
          <div><dt>City area</dt><dd className="num">{acres(era.hectares)}</dd></div>
          <div><dt>People</dt><dd className="num">{range(era.population)}</dd></div>
        </dl>
        <Bars active={eraId} />
        <p className="t3-scale">Bars use a log scale. 100 ha = 1 km².</p>
        <p className="ref"><span>{era.ref}</span></p>
        <p className="note">Outlines and numbers are scholarly estimates and differ between sources. Colours are schematic.</p>
      </section>

      <nav className="t3-eras" aria-label="Era">
        {ERAS.map((e) => (
          <button key={e.id} aria-pressed={e.id === eraId} onClick={() => setEraId(e.id)}>
            <span className="d num">{e.date}</span>
            <span className="t">{e.name}</span>
          </button>
        ))}
      </nav>

      <div className="t3-tools">
        <div className="t3-views" role="group" aria-label="View">
          {VIEWS.map((v) => (
            <button key={v.id} aria-pressed={v.id === view} onClick={() => go(v.id)}>{v.name}</button>
          ))}
        </div>
        <label className="t3-exag">
          <span>Height ×<b className="num">{exag.toFixed(1)}</b></span>
          <input type="range" min="1" max="4" step="0.5" value={exag} onChange={(e) => setExag(Number(e.target.value))} aria-label="Height exaggeration" />
        </label>
      </div>
      <p className="t3-help">Drag to orbit · scroll to zoom · right-drag or arrow keys to pan</p>
    </div>
  )
}
