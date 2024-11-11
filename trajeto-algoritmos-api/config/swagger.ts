// for AdonisJS v6
import path from 'node:path'
import url from 'node:url'
// ---

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // for AdonisJS v6
  title: 'Trajeto Algoritmos',
  version: '1.0.0',
  tagIndex: 2,
  snakeCase: true,
  ignore: ['/swagger', '/docs'],

  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  persistAuthorization: true, // persist authorization between reloads on the swagger page
}
