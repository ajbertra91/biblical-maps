import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Photo } from './data/photos'

interface Props {
  place: string
  photos: Photo[]
  onClose: () => void
}

/** A modal of site photos. Each photo is a local copy and shows its credit and license. */
export function PhotoViewer({ place, photos, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [i, setI] = useState(0)
  const photo = photos[i]
  const step = (d: number) => setI((n) => (n + d + photos.length) % photos.length)

  useEffect(() => {
    const dialog = ref.current
    // jsdom has no showModal.
    if (dialog && !dialog.open) dialog.showModal?.()
  }, [])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') step(-1)
    if (e.key === 'ArrowRight') step(1)
  }

  return (
    <dialog
      ref={ref}
      className="photos"
      aria-label={`Photos of ${place}`}
      // Escape, the close button and a backdrop click all close the dialog. Its close event unmounts it.
      onClose={onClose}
      onKeyDown={onKey}
      // A click on the backdrop lands on the dialog itself.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <header className="photos-bar">
        <b>{place}</b>
        <span className="num">{i + 1} / {photos.length}</span>
        <button className="photos-close" onClick={() => ref.current?.close()} aria-label="Close photos">✕</button>
      </header>
      <figure>
        <div className="photos-frame">
          <img key={photo.src} src={import.meta.env.BASE_URL + photo.src} alt={photo.caption} />
          {photos.length > 1 && (
            <>
              <button className="photos-step prev" onClick={() => step(-1)} aria-label="Previous photo">‹</button>
              <button className="photos-step next" onClick={() => step(1)} aria-label="Next photo">›</button>
            </>
          )}
        </div>
        <figcaption>
          <p>{photo.caption}</p>
          <p className="credit">
            Photo: {photo.credit} ·{' '}
            {photo.licenseUrl ? <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> : photo.license} ·{' '}
            <a href={photo.source} target="_blank" rel="noreferrer">Wikimedia Commons</a>
          </p>
        </figcaption>
      </figure>
      {photos.length > 1 && (
        <ol className="photos-thumbs" aria-label="All photos">
          {photos.map((p, n) => (
            <li key={p.src}>
              <button onClick={() => setI(n)} aria-current={n === i ? 'true' : undefined} aria-label={`Photo ${n + 1}: ${p.caption}`}>
                <img src={import.meta.env.BASE_URL + p.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </dialog>
  )
}
