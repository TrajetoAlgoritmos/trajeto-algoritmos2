/* eslint-disable unicorn/no-for-loop */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default async function getIdTokens() {
  const firebaseConfig = {
    apiKey: 'AIzaSyBQu3rxA7dxa_6OJm8u6--lMIUOlqal3B4',
    authDomain: 'trajeto-algoritmos-fe5a4.firebaseapp.com',
    projectId: 'trajeto-algoritmos-fe5a4',
    storageBucket: 'trajeto-algoritmos-fe5a4.appspot.com',
    messagingSenderId: '630024241939',
    appId: '1:630024241939:web:94a0a7e2d35450dd7e10e6',
    measurementId: 'G-NXZRRX5NRH',
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
