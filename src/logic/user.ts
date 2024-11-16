/* eslint-disable @typescript-eslint/no-extraneous-class */
import { password, publicUserInfo, username } from '../types'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { validatePassword, validateUser } from '../schemes/userDataValidation'
import { RowDataPacket } from 'mysql2'
import { connection } from './DB_config'

export class userLogic {
  static async create ({ username, password }: { username: username, password: password }): Promise<string> {
    const SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS) ?? 10
    // Validamos los datos
    validateUser(username)
    validatePassword(password)

    // Creamos el usuario
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    try {
      // Insertamos el nuevo usuario en la base de datos
      await (await connection).query(
            `INSERT INTO users (id, username, password) 
            VALUES (?, ?, ?);`,
            [id, username, hashedPassword]
      )
    } catch (e) {
      throw new Error('Error al crear el usuario')
    }
    return id
  }

  static async login ({ username, password }: { username: username, password: password }): Promise<publicUserInfo> {
    try {
      // Validamos los datos recibidos
      validateUser(username)
      validatePassword(password)

      // Buscamos el nombre de usuario en la base de datos
      const [query] = await (await connection).query<RowDataPacket[]>(
          `select * from users where username = "${username}";`
      )

      // Validamos los datos del usuario en la DB
      const user = query[0]
      if (user === undefined) throw new Error('No se han encontrado datos para este usuario')

      // Comparamos el usuario recibido con la DB
      const dbUsername = user.username
      if (dbUsername !== username) throw new Error('Usuario Incorrecto')

      // Comparamos la contraseña recibida con la DB
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) throw new Error('Password is invalid')

      // Devolvemos la data publica del usuario como objeto
      const { password: _, date, ...publicUser } = user
      return publicUser as publicUserInfo
    } catch (error) {
      throw new Error('Error al procesar el inicio de sesion')
    }
  }
}
