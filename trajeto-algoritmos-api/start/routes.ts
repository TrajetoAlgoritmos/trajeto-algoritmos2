/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import getIdTokens from '#config/auth_user_firebase'
import AlgorithmTestController from '#controllers/algorithms_test'
import FeedbackController from '#controllers/feedback_controller'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import AlgorithmController from '../app/controllers/algorithms_controller.js'
import AnswerController from '../app/controllers/answers_controller.js'
import JudgeController from '../app/controllers/run_conroller.js'
import TrackController from '../app/controllers/tracks_controller.js'
import UserController from '../app/controllers/user_controller.js'



router.post('/auth', new UserController().auth)

router.group(() => {
  router.post('/submissions', new JudgeController().submissions)

  router.post('/algorithmTest', new AlgorithmTestController().create)
  router.get('/algorithmTest', new AlgorithmTestController().index)
  router.get('/algorithmTest/:id', new AlgorithmTestController().show)
  router.put('/algorithmTest/:id', new AlgorithmTestController().update)
  router.delete('/algorithmTest/:id', new AlgorithmTestController().destroy)

  router.post('/algorithms', new AlgorithmController().create)
  router.get('/algorithms', new AlgorithmController().index)
  router.get('/algorithms/:id', new AlgorithmController().show)
  router.put('/algorithms/:id', new AlgorithmController().update)
  router.delete('/algorithms/:id', new AlgorithmController().destroy)

  router.post('/tracks', new TrackController().create)
  router.get('/tracks', new TrackController().index)
  router.get('/tracks/:id', new TrackController().show)
  router.put('/tracks/:id', new TrackController().update)
  router.delete('/tracks/:id', new TrackController().destroy)
  router.post('/tracks/join', new TrackController().join)
  router.post('/tracks/checkCodigo', new TrackController().findTrackByCodigo)

  router.post('/tracks/algorithm/add', new TrackController().addAlgorithm)
  router.post('/tracks/algorithm/remove', new TrackController().removeAlgorithm)
  router.post('/tracks/trackUsersSummary', new TrackController().trackUsersSummary)

  router.post('/answers', new AnswerController().create)
  router.get('/student/tracks/:id', new TrackController().showByStudent)
  router.get('/student/joinedTracks', new TrackController().tracksJoined)
  router.post('/student/tracks/start/:id', new TrackController().trackStartByStudent)
  router.post('/student/tracks/finish/:id', new TrackController().trackFinishByStudent)

  router.get('/student/getLastAnswer', new AnswerController().getLastAnswer)

  router.post('/feedback/send', new FeedbackController().send)
  router.get('/feedback/getByAlgorithm', new FeedbackController().feedbackByAlgorithm)
  router.get('/feedback/getByTrack', new FeedbackController().feedbackByTrack)
  router.get('/feedback/getByStudent', new FeedbackController().feedbackByStudent)
  router.get('/feedback/getByGroup', new FeedbackController().feedbackByGroup)
})

router.get('/token', async ({ response }: HttpContext) => {
  const r = await getIdTokens()
  response.send(r)
})
