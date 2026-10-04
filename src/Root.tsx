import { useEffect, useState } from 'react'
import App from './App'
import { Landing } from './Landing'
import { FAMILIES, type FamilyId } from './data/places'

/** The map family in the URL hash (#/ministry), or null for the landing page. */
const familyFromHash = (): FamilyId | null => {
  const id = window.location.hash.replace(/^#\/?/, '')
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

  return familyId ? <App key={familyId} initial={familyId} /> : <Landing />
}
