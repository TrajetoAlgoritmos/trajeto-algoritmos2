export enum JudgeStatusCode {
  NA_FILA = 1,
  PROCESSANDO = 2,
  ACEITO = 3,
  WRONG_ANSWER = 4,
  TIME_LIMIT_EXCEEDED = 5,
  COMPILATION_ERROR = 6,
  RUNTIME_ERROR_SIGSEGV = 7,
  RUNTIME_ERROR_SIGXFSZ = 8,
  RUNTIME_ERROR_SIGFPE = 9,
  RUNTIME_ERROR_SIGABRT = 10,
  RUNTIME_ERROR_NZEC = 11,
  RUNTIME_ERROR_OTHER = 12,
  INTERNAL_ERROR = 13,
  EXEC_FORMAT_ERROR = 14,
}
export function getStatusDescription(statusCode: JudgeStatusCode): string {
  switch (statusCode) {
    case JudgeStatusCode.NA_FILA:
      return 'Na fila'
    case JudgeStatusCode.PROCESSANDO:
      return 'Processando'
    case JudgeStatusCode.ACEITO:
      return 'Aceito'
    case JudgeStatusCode.WRONG_ANSWER:
      return 'Wrong Answer'
    case JudgeStatusCode.TIME_LIMIT_EXCEEDED:
      return 'Time Limit Exceeded'
    case JudgeStatusCode.COMPILATION_ERROR:
      return 'Compilation Error'
    case JudgeStatusCode.RUNTIME_ERROR_SIGSEGV:
      return 'Runtime Error (SIGSEGV)'
    case JudgeStatusCode.RUNTIME_ERROR_SIGXFSZ:
      return 'Runtime Error (SIGXFSZ)'
    case JudgeStatusCode.RUNTIME_ERROR_SIGFPE:
      return 'Runtime Error (SIGFPE)'
    case JudgeStatusCode.RUNTIME_ERROR_SIGABRT:
      return 'Runtime Error (SIGABRT)'
    case JudgeStatusCode.RUNTIME_ERROR_NZEC:
      return 'Runtime Error (NZEC)'
    case JudgeStatusCode.RUNTIME_ERROR_OTHER:
      return 'Runtime Error (Other)'
    case JudgeStatusCode.INTERNAL_ERROR:
      return 'Internal Error'
    case JudgeStatusCode.EXEC_FORMAT_ERROR:
      return 'Exec Format Error'
    default:
      return 'Unknown Status'
  }
}
