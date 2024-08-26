
export type username = string

export type password = string

export type zodSafeParse = { success: true, data: T } | { success: false, error: ZodError }

export type envVariables = number | string

export interface privateUserInfo {
  [
  id: string,
  username: string,
  password: string,
  avatar: string,
  date: string
  ]
}

export interface publicUserInfo {
  id: string
  username: string
  avatar: string

}

// Extendemos la propiedad "session" al tipo request para crear la sesion
declare module 'express-serve-static-core' {
  interface Request {
    session: {
      user: string | jwt.JwtPayload // Puedes definir un tipo más específico en lugar de 'any'
    }
  }
}
