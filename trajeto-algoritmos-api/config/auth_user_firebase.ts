/* eslint-disable unicorn/no-for-loop */
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default async function getIdTokens() {
  const firebaseConfig = {
    apiKey: 'AIzaSyC47YUXIFeXenQQvgUHrrcnfBaofnE3O4M',
    authDomain: 'trajeto-algoritmos.firebaseapp.com',
    projectId: 'trajeto-algoritmos',
    storageBucket: 'trajeto-algoritmos.appspot.com',
    messagingSenderId: '70964166016',
    appId: '1:70964166016:web:06cff243ddb135a5b15565',
    measurementId: 'G-3YYHRRL9NZ',
  }
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  const credentials = [
    {
      email: 'teacher@ufgd.edu.br',
      password: '123456',
      token: '',
    },
    {
      email: 'student@academico.ufgd.edu.br',
      password: '123456',
      token: '',
    },
    {
      email: 'student2@academico.ufgd.edu.br',
      password: 'senhamuitodificil',
      token: '',
    },
  ]

  for (let i = 0; i < credentials.length; i++) {
    const c = credentials[i]
    const result = await signInWithEmailAndPassword(auth, c.email, c.password)
    credentials[i].token = await result.user.getIdToken()
  }

  return credentials
}
