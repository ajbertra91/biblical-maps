import { lazy, Suspense, useEffect, useState } from 'react'
import App from './App'
import { Landing } from './Landing'
import { FAMILIES, type FamilyId } from './data/places'

const Terrain3D = lazy(() => import('./Terrain3D').then((m) => ({ default: m.Terrain3D })))

const TERRAIN = 'terrain'

/** The map family in the URL hash (#/ministry), or null for the landing page. */
const familyFromHash = (): FamilyId | typeof TERRAIN | null => {
  if (window.location.hash.replace(/^#\/?/, '').split('?')[0] === TERRAIN) return TERRAIN
  const id = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return FAMILIES.find((f) => f.id === id)?.id ?? null
}

export function Root() {
  const [familyId, setFamilyId] = useState(familyFromHash)

  useEffect(() => {
    const onHash = () => {
      setFamilyId(familyFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (familyId === TERRAIN) return <Suspense fallback={null}><Terrain3D /></Suspense>
  return familyId ? <App key={familyId} initial={familyId} /> : <Landing />
}
