import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const hier = dirname(fileURLToPath(import.meta.url))
const pub = join(hier, '..', 'public')
const svg = readFileSync(join(pub, 'favicon.svg'))

for (const [naam, maat] of [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['apple-touch-icon-180x180.png', 180],
]) {
  await sharp(svg).resize(maat, maat).png().toFile(join(pub, naam))
  console.log('geschreven', naam)
}
