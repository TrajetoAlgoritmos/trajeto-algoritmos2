import Answer from '#models/answer'
import AnswerAlgorithmTest from '#models/answer_algorithm_tests'
import { AnswerStatus, ProfileId } from '#models/enums'
import TrackAlgorithm from '#models/track_algorithm'
import TrackUser from '#models/track_user'
import { DateTime } from 'luxon'
import Algorithm from '../../app/models/algorithm.js'
import AlgorithmTest from '../../app/models/algorithm_test.js'
import Track from '../../app/models/track.js'
import User from '../../app/models/user.js'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await this.seedUsers()
    await this.seedTracks()
    await this.seedAlgorithms()
    await this.seedAlgorithmTests()
    await this.seedTrackAlgorithms()
    await this.seedTrackAnswer()
    await this.seedAnswerAlgorithmTests()

    await TrackUser.createMany([
      {
        trackId: 1,
        userId: 2,
      },
      {
        trackId: 2,
        userId: 2,
      },
    ])
  }

  readonly teacherEmail = 'teacher@ufgd.edu.br'
  readonly studentEmail = 'student@academico.ufgd.edu.br'
  readonly studen2tEmail = 'student2@academico.ufgd.edu.br'
  readonly studen3tEmail = 'student3@academico.ufgd.edu.br'

  private async seedUsers() {
    const existingTeacher = await User.findBy('email', this.teacherEmail)
    const existingStudent = await User.findBy('email', this.studentEmail)
    const existingStudent2 = await User.findBy('email', this.studen2tEmail)
    const existingStudent3 = await User.findBy('email', this.studen3tEmail)

    if (!existingTeacher) {
      await User.create({
        id: 1,
        providerId: '123456',
        name: 'Teacher',
        email: this.teacherEmail,
        password: 'password123',
        profileId: ProfileId.teacher,
      })
    }

    if (!existingStudent) {
      await User.create({
        id: 2,
        providerId: '789012',
        name: 'Studend',
        email: this.studentEmail,
        password: '789012',
        profileId: ProfileId.student,
      })
    }
    if (!existingStudent2) {
      await User.create({
        id: 3,
        providerId: '789012',
        name: 'Studend2',
        email: this.studen2tEmail,
        password: '789012',
        profileId: ProfileId.student,
      })
    }
    if (!existingStudent3) {
      await User.create({
        id: 4,
        providerId: '789012',
        name: 'Studend3',
        email: this.studen3tEmail,
        password: '789012',
        profileId: ProfileId.student,
      })
    }
  }

  private async seedTracks() {
    const user = await User.findByOrFail('email', this.teacherEmail)
    const existingTracks = await Track.query().where('user_id', user.id)

    if (existingTracks.length === 0) {
      await Track.createMany([
        {
          title: 'Track 1',
          description: 'Description for Track 1',
          userId: user.id,
          startAt: DateTime.now().minus({ days: 1 }),
          closeAt: DateTime.now().plus({ days: 999 }),
        },
        {
          title: 'Track 2',
          description: 'Description for Track 2',
          userId: user.id,
          startAt: DateTime.now().minus({ days: 1 }),
          closeAt: DateTime.now().plus({ days: 999 }),
        },
      ])
    }
  }

  private async seedAlgorithms() {
    const user = await User.findByOrFail('email', this.teacherEmail)
    const existingAlgorithms = await Algorithm.query().where('user_id', user.id)

    if (existingAlgorithms.length === 0) {
      await Algorithm.createMany([
        {
          title: 'Algorithm 1',
          description: 'Description for Algorithm 1',
          tag: 'tag1',
          userId: user.id,
        },
        {
          title: 'Algorithm 2',
          description: 'Description for Algorithm 2',
          tag: 'tag2',
          userId: user.id,
        },
      ])
    }
  }

  private async seedAlgorithmTests() {
    const alg1 = await Algorithm.findByOrFail('title', 'Algorithm 1')
    const alg2 = await Algorithm.findByOrFail('title', 'Algorithm 2')
    const user = await User.findByOrFail('email', this.teacherEmail)
    const existingTests = await AlgorithmTest.query().where('user_id', user.id)

    if (existingTests.length === 0) {
      await AlgorithmTest.createMany([
        {
          algorithmId: alg1.id,
          input: 'Input for Algorithm 1 Test',
          output: 'Output for Algorithm 1 Test',
          userId: user.id,
        },
        {
          algorithmId: alg2.id,
          input: 'Input for Algorithm 2 Test',
          output: 'Output for Algorithm 2 Test',
          userId: user.id,
        },
      ])
    }
  }

  private async seedTrackAlgorithms() {
    const track = await Track.findByOrFail('title', 'Track 1')
    const alg1 = await Algorithm.findByOrFail('title', 'Algorithm 1')
    const alg2 = await Algorithm.findByOrFail('title', 'Algorithm 2')
    const existingTrackAlgorithms = await TrackAlgorithm.query().where('trackId', track.id)

    if (existingTrackAlgorithms.length === 0) {
      await TrackAlgorithm.createMany([
        {
          trackId: track.id,
          algorithmId: alg1.id,
        },
        {
          trackId: track.id,
          algorithmId: alg2.id,
        },
      ])
    }
  }

  private async seedTrackAnswer() {
    const track = await Track.findByOrFail('title', 'Track 1')
    const trackAlgorithms = await TrackAlgorithm.query().where('trackId', track.id)

    const alg1 = await Algorithm.findByOrFail('title', 'Algorithm 1')
    const user = await User.findByOrFail('email', this.studentEmail)
    const existingTrackAnswers = await Answer.query().where('user_id', user.id)

    if (existingTrackAnswers.length === 0) {
      for (const trackAlgorithm of trackAlgorithms) {
        const isAlg1 = trackAlgorithm.algorithmId === alg1.id

        const content = isAlg1
          ? 'aW50IG1haW4oKQ0Kew0KICAgIHByaW50ZigiSW5wdXQgZm9yIEFsZ29yaXRobSAxIFRlc3QiKTsNCg0KICAgIHJldHVybiAwOw0KfQ=='
          : 'aW50IG1haW4oKQ0Kew0KICAgIHByaW50ZigiSW5wdXQgZm9yIEFsZ29yaXRobSAxIFRlc3QiKTsNCg0KICAgIHJldHVybiAwOw0KfQ=='

        await Answer.createMany([
          {
            trackAlgorithmId: trackAlgorithm.id,
            user_id: user.id,
            status: AnswerStatus.error,
            content: 'aW50IG1haW4oKQ0Kew0KICAgIHByaW50ZjsNCg0KICAgIHJldHVybiAwOw0KfQ==',
          },
          {
            trackAlgorithmId: trackAlgorithm.id,
            user_id: user.id,
            status: AnswerStatus.incorrect,
            content:
              'aW50IG1haW4oKQ0Kew0KICAgIHByaW50ZigiSW5wdXQgZm9yIEFsZ29yaXRobSBibGFibGEiKTsNCg0KICAgIHJldHVybiAwOw0KfQ==',
          },
          {
            trackAlgorithmId: trackAlgorithm.id,
            user_id: user.id,
            status: AnswerStatus.correct,
            content: content,
          },
        ])
      }
    }
  }

  private async seedAnswerAlgorithmTests() {
    const alg1 = await Algorithm.findByOrFail('title', 'Algorithm 1')
    const alg2 = await Algorithm.findByOrFail('title', 'Algorithm 2')
    const user = await User.findByOrFail('email', this.studentEmail)
    const existingAnswerAlgorithmTests = await AlgorithmTest.query().where('user_id', user.id)

    // retrive all algorithm tests of alg1 and alg2
    const alg1Tests = await AlgorithmTest.query().where('algorithm_id', alg1.id)
    const alg2Tests = await AlgorithmTest.query().where('algorithm_id', alg2.id)

    // retrive all anwers of user for alg1 and alg2

    const track = await Track.findByOrFail('title', 'Track 1')
    const trackAlgorithms = await TrackAlgorithm.query().where('trackId', track.id)
    let answers = await Answer.query().where('user_id', user.id).preload('trackAlgorithm')

    const alg1Answers = answers.filter((answer) => {
      const trackAlgorithm = trackAlgorithms.find((ta) => ta.id === answer.trackAlgorithmId)
      return trackAlgorithm?.algorithmId === alg1.id
    })

    const alg2Answers = answers.filter((answer) => {
      const trackAlgorithm = trackAlgorithms.find((ta) => ta.id === answer.trackAlgorithmId)
      return trackAlgorithm?.algorithmId === alg2.id
    })

    if (existingAnswerAlgorithmTests.length === 0) {
      for (const answer of alg1Answers) {
        for (const test of alg1Tests) {
          await AnswerAlgorithmTest.createMany([
            {
              user_id: user.id,
              answerId: answer.id,
              algorithmTestsId: test.id,
              content: answer.content,
              status: answer.status,
            },
            {
              user_id: user.id,
              answerId: answer.id,
              algorithmTestsId: test.id,
              content: answer.content,
              status: answer.status,
            },
            {
              user_id: user.id,
              answerId: answer.id,
              algorithmTestsId: test.id,
              content: answer.content,
              status: answer.status,
            },
          ])
        }
      }

      for (const answer of alg2Answers) {
        for (const test of alg2Tests) {
          await AnswerAlgorithmTest.createMany([
            {
              user_id: user.id,
              answerId: answer.id,
              algorithmTestsId: test.id,
              content: answer.content,
              status: answer.status,
            },
            {
              user_id: user.id,
              answerId: answer.id,
              algorithmTestsId: test.id,
              content: answer.content,
              status: answer.status,
            },
            {
              user_id: user.id,
              answerId: answer.id,
              algorithmTestsId: test.id,
              content: answer.content,
              status: answer.status,
            },
          ])
        }
      }
    }
  }
}
