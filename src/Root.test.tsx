import { afterEach, describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Root } from './Root'
import { FAMILIES } from './data/places'

afterEach(() => window.history.replaceState(null, '', '/'))

const goHash = (hash: string) => act(() => {
  window.history.replaceState(null, '', hash)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
})

describe('Root', () => {
  it('opens on the landing page with a link to each map', () => {
    render(<Root />)
    expect(screen.getByRole('heading', { name: 'Choose a map' })).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    for (const f of FAMILIES) {
      expect(links.find((a) => a.getAttribute('href') === `#/${f.id}`), f.id).toHaveTextContent(f.name)
    }
  })

  it('opens the map in the hash', () => {
    window.history.replaceState(null, '', '#/ministry')
    render(<Root />)
    expect(screen.getByRole('heading', { name: 'Jesus' })).toBeInTheDocument()
  })

  it('moves between the landing page and a map when the hash changes', () => {
    render(<Root />)
    goHash('#/abraham')
    expect(screen.getByRole('heading', { name: 'Abraham' })).toBeInTheDocument()
    goHash('#/')
    expect(screen.getByRole('heading', { name: 'Choose a map' })).toBeInTheDocument()
  })

  it('shows the landing page for an unknown hash', () => {
    window.history.replaceState(null, '', '#/nowhere')
    render(<Root />)
    expect(screen.getByRole('heading', { name: 'Choose a map' })).toBeInTheDocument()
  })

  it('keeps the URL on the map the user picks', () => {
    window.history.replaceState(null, '', '#/military')
    render(<Root />)
    fireEvent.click(screen.getByRole('button', { name: 'Kings' }))
    expect(window.location.hash).toBe('#/kings')
  })

  it('links from a map back to the landing page', () => {
    window.history.replaceState(null, '', '#/ministry')
    render(<Root />)
    const home = screen.getByRole('link', { name: 'All maps' })
    expect(home).toHaveAttribute('href', '#/')
    goHash(home.getAttribute('href')!)
    expect(screen.getByRole('heading', { name: 'Choose a map' })).toBeInTheDocument()
  })
})
