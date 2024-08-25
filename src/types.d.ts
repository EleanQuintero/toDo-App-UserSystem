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
