import admin from 'firebase-admin'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)
const serviceAccountString = readFileSync(join(dirName + '/serviceAccountKey.json'), 'utf8')
const serviceAccount = JSON.parse(serviceAccountString)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
