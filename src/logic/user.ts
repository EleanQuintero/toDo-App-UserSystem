/* eslint-disable @typescript-eslint/no-extraneous-class */
import { SALT_ROUNDS } from '../const'
import { password, publicUserInfo, username } from '../types'
import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'
import crypto from 'node:crypto'
import { validatePassword, validateUser } from '../schemes/userDataValidation'
import { RowDataPacket } from 'mysql2'

export const DB_HOST = 'localhost'
export const DB_USER = 'root'
export const DB_PASSWORD = ''
export const DB_PORT = 3306
export const DB_NAME = 'TodosDB'

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME
}

// Creamos conexion con DB
const connection = mysql.createConnection(config)

export class userLogic {
  static async create ({ username, password }: { username: username, password: password }): Promise<string> {
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

      const user = query[0]
      if (user === undefined) throw new Error('No se han encontrado datos para este usuario')
      console.log(user)

      const dbUsername = user.username
      if (dbUsername !== username) throw new Error('Usuario Incorrecto')

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) throw new Error('Password is invalid')

      const { password: _, date, ...publicUser } = user
      return publicUser
    } catch (error) {
      throw new Error('Error al procesar el inicio de sesion')
    }
  }
}
