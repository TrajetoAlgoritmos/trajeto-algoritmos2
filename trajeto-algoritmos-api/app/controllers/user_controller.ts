import { HttpContext } from '@adonisjs/core/http'
import admin from '#config/firebase'
import { getUserFromFirebaseUser } from '../utils/user_from_firebase_user.js'

export default class UserController {
  /**
   * @custom
   * @summary Returns array of producs and it's relations
   * @responseBody 200 - <AuthResponse>
   * @requestBody <AuthRequest>
   */
  async auth({ request, response }: HttpContext) {
    const { tokenId } = request.all()

    const token = await admin.auth().verifyIdToken(tokenId)

    const firebaseUser = await admin.auth().getUser(token.uid)

    const res = await getUserFromFirebaseUser(firebaseUser)

    response.status(200).json({
      data: {
        user: {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          profileId: res.user.profileId,
        },
        accessToken: {
          type: res.accessToken.toJSON().type,
          token: res.accessToken.toJSON().token,
          expiresAt: res.accessToken.toJSON().expiresAt,
        },
      },
    })
  }
}
