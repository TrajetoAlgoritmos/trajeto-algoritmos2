import { JudgeStatusCode } from '#services/judge_status'
import User from '../models/user.js'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export interface JudgeResponse {}

export interface BaseResponse<T> {
  data: T
}
export interface UserAndAccessToken {
  user: User
  accessToken: AccessToken
}
// retornar usuario
export interface AuthResponse extends BaseResponse<UserAndAccessToken> {}

export interface AuthRequest {
  tokenId: string
}

export interface AlgorithmRunResponse {
  stdout: String
  time: String
  memory: String
  stderr: String | null
  token: String
  compile_output: String | null
  message: String | null
  status: {
    id: JudgeStatusCode
    description: String
  }
}
