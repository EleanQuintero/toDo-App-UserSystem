import z from 'zod'
import { password, username } from '../types'

const usernameSchema = z.string({
  required_error: 'el nombre de usuario es requerido'
})
  .min(1, 'el nombre de usuario no puede estar vacio')
  .min(5, 'el nombre de usuario debe tener minimo 5 caracteres')
  .max(8, 'el nombre de usuario debe tener maximo 8 caracteres')

const passwordSchema = z.string({
  required_error: 'la contraseña es requerida'
})
  .min(1, 'la contraseña no puede estar vacia')
  .min(8, 'la contraseña debe tener minimo 8 caracteres')
  .max(20, 'la contraseña debe tener maximo 20 caracteres')

export function validateUser (username: username): string | z.ZodIssue[] {
  const result = usernameSchema.safeParse(username)

  if (!result.success) {
    const error = result.error.issues[0].message
    console.error(error)
    throw new Error('Error al crear el usuario')
  }

  return result.data
}

export function validatePassword (password: password): string {
  const result = passwordSchema.safeParse(password)

  if (!result.success) {
    const error = result.error.issues[0].message
    console.error(error)
    throw new Error('Error al crear la contraseña')
  }

  return result.data
}
