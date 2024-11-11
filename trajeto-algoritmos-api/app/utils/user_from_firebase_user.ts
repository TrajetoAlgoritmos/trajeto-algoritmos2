import User from '#models/user'
import { UserRecord } from 'firebase-admin/auth'
import { UserAndAccessToken } from '../interfaces/index.js'
import { getProfileFromEmail } from './email_utils.js'

const getUserFromFirebaseUser = async (firebaseUser: UserRecord): Promise<UserAndAccessToken> => {
  const user = await User.findBy('email', firebaseUser.email)

  if (user) {
    const accessToken = await User.accessTokens.create(user)

    return { user, accessToken }
  }

  const newUser = await User.create({
    providerId: firebaseUser.uid,
    name: firebaseUser.displayName ?? 'Usuário',
    email: firebaseUser.email,
    password: firebaseUser.uid,
    profileId: getProfileFromEmail(firebaseUser.email!),
  })

  const accessToken = await User.accessTokens.create(newUser)
  return { user: newUser, accessToken }
}

export { getUserFromFirebaseUser }
