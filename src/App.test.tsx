import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App.tsx'
import { PhotoViewer } from './PhotoViewer'
import { FAMILIES, PLACES } from './data/places'
import { PHOTOS } from './data/photos'

// Every photo file in public/assets. Vite lists the paths. It does not load the files.
const FILES = Object.keys(import.meta.glob('/public/assets/places/**/*.jpg'))

const REF = /^(Gen|Exod|Num|Deut|Josh|1 Sam|2 Sam|1 Kgs|2 Kgs|Matt|Luke|John|Acts) \d+/

describe('App', () => {
  it('opens on the conquest overview with a Scripture-cited stop list', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Conquest' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: /conquest stops/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /jericho, josh 6:20/i })).toBeInTheDocument()
  })

  it('cites Scripture and has a known place for every stop', () => {
    for (const f of FAMILIES) {
      for (const s of f.stops) {
        expect(PLACES[s.place], `${f.id}: ${s.place}`).toBeDefined()
        expect(s.ref).toMatch(REF)
        for (const m of s.moves ?? []) {
          expect(m.ref, `${f.id}: ${m.label}`).toMatch(REF)
          expect(m.path.length).toBeGreaterThan(1)
          for (const id of m.path) expect(PLACES[id], `${f.id}: ${m.label}: ${id}`).toBeDefined()
        }
      }
    }
  })

  it('shows Saul and David battles with cited army movements', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Kings' }))
    expect(screen.getByRole('heading', { name: 'Kings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mount gilboa, 1 sam 31:1–6/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rabbah, 2 sam 10:6–14; 2 sam 11:1, 14–17; 2 sam 12:26–31/i })).toBeInTheDocument()
    expect(document.querySelector('.routes path')).toBeNull()
  })

  it('marks the Rephaim peoples of Deuteronomy on the military map', () => {
    render(<App />)
    for (const name of ['Anakim', 'Emim', 'Zamzummim', 'Rephaim of Bashan']) {
      expect(document.querySelector('.giant')?.closest('svg')).toHaveTextContent(name)
    }
    for (const g of FAMILIES.flatMap((f) => f.giants ?? [])) {
      expect(g.ref).toMatch(/^(Deut|2 Sam) \d+/)
      for (const id of g.places) expect(PLACES[id], `${g.id}: ${id}`).toBeDefined()
    }
  })

  it('shows every reference for a place in a pop-up on focus', () => {
    render(<App />)
    fireEvent.focus(screen.getByRole('button', { name: /^ai, josh 7:2–5; josh 8:1–29/i }))
    const box = document.querySelector('.cite-box')!
    expect(box).toHaveTextContent('Ai')
    expect(box).toHaveTextContent('Josh 7:2–5')
    expect(box).toHaveTextContent('Josh 8:1–29')
  })

  it('puts the Table of Nations first, then Abraham', () => {
    render(<App />)
    const tabs = screen.getByRole('group', { name: 'Map family' })
    const [first, second] = tabs.querySelectorAll('button')
    expect(first).toHaveTextContent('Nations')
    expect(second).toHaveTextContent('Abraham')
    fireEvent.click(first)
    expect(screen.getByRole('heading', { name: 'Nations' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^gomer, gen 10:2–3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sheba, gen 10:7; gen 10:28/i })).toBeInTheDocument()
  })

  it('follows Abraham from Ur to the sacrifice of Isaac', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Abraham' }))
    expect(screen.getByRole('heading', { name: 'Abraham' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ur, gen 11:27–31/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mount moriah, gen 22:1–14/i })).toBeInTheDocument()
  })

  it('has a local file and a credit for every site photo', () => {
    for (const [id, photos] of Object.entries(PHOTOS)) {
      expect(PLACES[id], id).toBeDefined()
      for (const p of photos) {
        expect(FILES, p.src).toContain(`/public/${p.src}`)
        expect(p.credit, p.src).not.toBe('')
        expect(p.source, p.src).toMatch(/^https:\/\/commons\.wikimedia\.org\//)
      }
    }
  })

  it('steps through site photos with their credits', () => {
    // jsdom does not scroll, so the stop panel stays on the overview. Test the viewer alone.
    render(<PhotoViewer place="Ur" photos={PHOTOS.ur} onClose={() => {}} />)
    // jsdom has no showModal, so the dialog stays closed and has no role. Query it directly.
    const dialog = document.querySelector('dialog[aria-label="Photos of Ur"]')!
    expect(dialog).toHaveTextContent(PHOTOS.ur[0].caption)
    expect(dialog).toHaveTextContent(PHOTOS.ur[0].credit)
    fireEvent.click(screen.getByLabelText('Next photo'))
    expect(dialog).toHaveTextContent(PHOTOS.ur[1].caption)
    fireEvent.click(screen.getByLabelText('Previous photo'))
    fireEvent.click(screen.getByLabelText('Previous photo'))
    expect(dialog).toHaveTextContent(PHOTOS.ur.at(-1)!.caption)
  })

  it('switches the map family', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Jesus' }))
    expect(screen.getByRole('heading', { name: 'Jesus' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nazareth, luke 4:16/i })).toBeInTheDocument()
  })

  it('follows Paul on four journeys in Acts', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Paul' }))
    expect(screen.getByRole('heading', { name: 'Paul' })).toBeInTheDocument()
    const paul = FAMILIES.find((f) => f.id === 'paul')!
    expect(paul.stops.every((s) => s.ref.startsWith('Acts'))).toBe(true)
    expect([...new Set(paul.stops.map((s) => s.journey))]).toEqual(['First journey', 'Between journeys', 'Second journey', 'Third journey', 'Journey to Rome'])
    expect(screen.getByRole('button', { name: /^paphos, acts 13:6–12/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^athens, acts 17:15–34/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^miletus, acts 20:15–38/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^rome, acts 28:14–31/i })).toBeInTheDocument()
    // The seven churches of Revelation lie on the route from Lystra to Troas. They are not stops.
    const via = Object.values(paul.via!).flat()
    expect(via.map((v) => v.place)).toEqual(['laodicea', 'philadelphia', 'ephesus', 'smyrna', 'sardis', 'thyatira', 'pergamum'])
    for (const v of via) expect(v.ref).toMatch(/^Rev [23]:/)
    expect(Object.keys(paul.via!).map((k) => paul.stops[+k].place)).toEqual(['lystra'])
    expect(paul.stops.some((s) => ['laodicea', 'sardis', 'smyrna'].includes(s.place))).toBe(false)
  })

  it('puts Pentecost to the right of Jesus', () => {
    render(<App />)
    const labels = [...screen.getByRole('group', { name: 'Map family' }).querySelectorAll('button')].map((b) => b.textContent)
    expect(labels.indexOf('Pentecost')).toBe(labels.indexOf('Jesus') + 1)
    fireEvent.click(screen.getByRole('button', { name: 'Pentecost' }))
    expect(screen.getByRole('button', { name: /^parthia, acts 2:9/i })).toBeInTheDocument()
  })
})
