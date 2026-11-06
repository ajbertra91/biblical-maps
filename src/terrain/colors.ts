import { Color } from 'three'

/** Classes of surface the map tells apart. */
export type Surface = 'sea' | 'lake' | 'land'

const C = (hex: number) => new Color(hex)
const lowGreen = C(0x6f8450)
const hillStone = C(0xb9aa86)
const desert = C(0xc2a470)
const darkDesert = C(0x8d7650)
const high = C(0xd8d1bb)
const mountain = C(0x8f8a78)
const shoal = C(0x3a93a4)
const deepSea = C(0x0f3a52)
const lakeBlue = C(0x2c7fa0)
const deadSea = C(0x3b8ea0)

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export interface Shaded { y: number; color: Color; surface: Surface }

/** Height in metres and colour of the ground at a place. Water sits flat. Colours are schematic. */
export function shade(lon: number, lat: number, e: number, out: Color = new Color()): Shaded {
  // The Dead Sea, the Sea of Galilee and the two seas, which sit flat.
  if (lat > 31.0 && lat < 31.8 && lon > 35.36 && lon < 35.65 && e < -390) return { y: -430, color: out.copy(deadSea), surface: 'lake' }
  if (lat > 32.69 && lat < 32.9 && lon > 35.48 && lon < 35.66 && e < -206) return { y: -210, color: out.copy(lakeBlue), surface: 'lake' }
  const med = e <= 0 && lon < 35.08 && lat > 30.4
  const gulf = e <= 0 && lat < 29.58
  if (med || gulf) {
    const depth = Math.min(1, -e / 600)
    return { y: Math.max(e, -120) * 0.5, color: out.copy(shoal).lerp(deepSea, Math.pow(depth, 0.6)), surface: 'sea' }
  }
  // Rain falls in the north and the west. The Negev and the Judean wilderness are dry.
  let green = smooth(30.9, 32.2, lat)
  const wilderness = smooth(35.2, 35.38, lon) * smooth(31.25, 31.4, lat) * (1 - smooth(31.8, 31.95, lat))
  green *= 1 - 0.9 * wilderness
  green *= 1 - 0.6 * (1 - smooth(30.9, 31.5, lat)) * smooth(34.7, 34.95, lon)
  green = Math.max(green, 0.8 * (1 - smooth(34.6, 34.9, lon)) * smooth(31.0, 31.4, lat))
  const dry = e < 0 ? darkDesert : desert
  out.copy(dry).lerp(hillStone, smooth(150, 700, e) * 0.9)
  out.lerp(lowGreen, green * (1 - smooth(500, 1100, e)) * 0.85)
  if (e > 1100) out.lerp(e > 2000 ? high : mountain, smooth(1100, 2400, e))
  return { y: e, color: out, surface: 'land' }
}
