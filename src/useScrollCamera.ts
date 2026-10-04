import { useEffect, useRef, useState, type RefObject } from 'react'
import { cameraAt, flight, viewBox, type Key } from './camera'
import { kmPerUnit, unproject, type Pt } from './data/geo-utils'

interface Opts {
  keys: Key[]
  stopCount: number
  svgRef: RefObject<SVGSVGElement | null>
  stageRef: RefObject<HTMLDivElement | null>
  readout: RefObject<HTMLElement | null>
  /** Scripture pop-up. It follows `citeAt`, a point in map units. */
  cite: RefObject<HTMLElement | null>
  citeAt: RefObject<{ p: Pt; hover: boolean } | null>
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Maps page scroll to camera, route progress and pin state. Writes to the DOM, not to React state. */
export function useScrollCamera({ keys, stopCount, svgRef, stageRef, readout, cite, citeAt }: Opts) {
  const [chapter, setChapter] = useState(0)
  const target = useRef(0)
  const current = useRef(0)
  const lastChapter = useRef(0)

  useEffect(() => {
    const svg = svgRef.current
    const stage = stageRef.current
    if (!svg || !stage) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let raf = 0
    let last = performance.now()
    let w = stage.clientWidth
    let h = stage.clientHeight

    const readScroll = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight
      target.current = room > 0 ? clamp01(window.scrollY / room) * stopCount : 0
    }

    const draw = (t: number) => {
      const cam = cameraAt(keys, t, w / h)
      const vb = viewBox(cam, w, h)
      svg.setAttribute('viewBox', `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`)
      const st = stage.style
      st.setProperty('--k', (vb.w / w).toFixed(5))
      st.setProperty('--t', (t / Math.max(1, stopCount)).toFixed(4))
      const level = cam.s > 420 ? 'wide' : cam.s > 180 ? 'mid' : 'close'
      if (stage.dataset.level !== level) stage.dataset.level = level
      for (let i = 0; i < stopCount; i++) {
        // Leg i joins stop i to stop i+1 and draws during the flight that starts at t = i + 1.
        st.setProperty(`--l${i}`, flight(t - (i + 1)).toFixed(4))
        const arrive = i === 0 ? 0.55 : i + 0.62
        st.setProperty(`--r${i}`, clamp01((t - arrive) / 0.14).toFixed(3))
      }
      const c = unproject(cam.x, cam.y)
      const el = readout.current
      if (el) {
        const km = vb.w * 0.18 * kmPerUnit(c.lat)
        const nice = [1, 2, 5, 10, 20, 50, 100, 200, 500].find((n) => n >= km / 1.6) ?? 500
        const px = (nice / kmPerUnit(c.lat) / vb.w) * w
        el.style.setProperty('--bar', `${px.toFixed(1)}px`)
        const set = (sel: string, v: string) => {
          const n = el.querySelector(sel)
          if (n && n.textContent !== v) n.textContent = v
        }
        set('.v-lat', `${Math.abs(c.lat).toFixed(3)}°${c.lat >= 0 ? 'N' : 'S'}`)
        set('.v-lon', `${Math.abs(c.lon).toFixed(3)}°${c.lon >= 0 ? 'E' : 'W'}`)
        set('.v-bar', `${nice} km`)
      }
      // The pop-up sits on its pin. For the current stop it fades out during the flight.
      const pop = cite.current
      if (pop) {
        const at = citeAt.current
        const o = !at ? 0 : at.hover ? 1 : clamp01(1 - Math.abs(t - Math.round(t)) * 4)
        pop.style.opacity = o.toFixed(3)
        if (at) {
          const sx = ((at.p[0] - vb.x) / vb.w) * w
          const sy = ((at.p[1] - vb.y) / vb.h) * h
          pop.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`
        }
      }
      const ch = Math.min(stopCount, Math.max(0, Math.round(t)))
      if (ch !== lastChapter.current) {
        lastChapter.current = ch
        setChapter(ch)
      }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const diff = target.current - current.current
      if (reduce?.matches || Math.abs(diff) < 0.0004) current.current = target.current
      else current.current += diff * (1 - Math.exp(-dt * 5.5))
      draw(current.current)
      raf = requestAnimationFrame(frame)
    }

    const resize = () => {
      w = stage.clientWidth
      h = stage.clientHeight
    }
    readScroll()
    current.current = target.current
    raf = requestAnimationFrame(frame)
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', resize)
    }
  }, [keys, stopCount, svgRef, stageRef, readout, cite, citeAt])

  return { chapter }
}
