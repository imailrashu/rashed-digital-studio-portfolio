import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url)
const distPath = dist.pathname.replace(/^\/(?:([A-Za-z]:))/, '$1')
const indexPath = join(distPath, 'index.html')

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html is missing. Run npm run build before npm test.')
}

const html = readFileSync(indexPath, 'utf8')
const required = [
  'Style Zone',
  'Private Dhakuria Salon Website Proposal',
  'noindex, nofollow, noarchive',
]

for (const text of required) {
  if (!html.includes(text)) throw new Error(`Built HTML is missing: ${text}`)
}

const assetsPath = join(distPath, 'assets')
if (!existsSync(assetsPath) || readdirSync(assetsPath).length === 0) {
  throw new Error('Built asset directory is missing or empty.')
}

for (const image of ['salon-interior.jpg', 'salon-detail.jpg']) {
  if (!existsSync(join(distPath, 'images', image))) {
    throw new Error(`Built image is missing: ${image}`)
  }
}

for (const sourceFile of ['src/data/business.ts', 'src/components/BusinessChatbot.tsx', 'src/chat/localKnowledge.ts']) {
  if (!existsSync(new URL(`../${sourceFile}`, import.meta.url))) {
    throw new Error(`Required shared business/chatbot source is missing: ${sourceFile}`)
  }
}

console.log('Static production checks passed.')
