import getIdTokens from '#config/auth_user_firebase'
import AlgorithmTestController from '#controllers/algorithms_test'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import JudgeController from '../app/controllers/run_conroller.js'
import UserController from '../app/controllers/user_controller.js'

// Rota raiz
router.get('/', async ({ response }: HttpContext) => {
  response.send({ message: 'Welcome to the API!' })
})

// Rota de autenticação
router.post('/auth', new UserController().auth)

// Agrupamento de rotas
router.group(() => {
  // Rotas de submissões
  router.post('/submissions', new JudgeController().submissions)

  // Rotas de testes de algoritmos
  router.post('/algorithmTest', new AlgorithmTestController().create)
  router.get('/algorithmTest', new AlgorithmTestController().index)
  router.get('/algorithmTest/:id', new AlgorithmTestController().show)
  router.put('/algorithmTest/:id', new AlgorithmTestController().update)
  router.delete('/algorithmTest/:id', new AlgorithmTestController().destroy)

  // Outras rotas...
})

// Exemplo de rota adicional
router.get('/token', async ({ response }: HttpContext) => {
  const r = await getIdTokens()
  response.send(r)
})
