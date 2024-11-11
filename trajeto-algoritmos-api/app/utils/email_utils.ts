import { ProfileId } from '../models/enums.js'

const getProfileFromEmail = (email: string): ProfileId => {
  if (email.includes('@academico.ufgd.edu.br')) {
    return ProfileId.student
  } else if (email.includes('@ufgd.edu.br')) {
    return ProfileId.teacher
  } else {
    throw Error('E-mail inválido!')
  }
}

export { getProfileFromEmail }
