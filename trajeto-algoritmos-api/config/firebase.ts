import admin from 'firebase-admin'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

const serviceAccountString = readFileSync(join(dirName + '/serviceAccountKey.json'), 'utf8')
const serviceAccount = JSON.parse(serviceAccountString)

// ✅ CORREÇÃO CRÍTICA: transformar `\\n` em `\n`
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin