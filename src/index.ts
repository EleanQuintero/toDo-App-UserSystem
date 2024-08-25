/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { saludo, SECRET_KEY } from './const'
import { userLogic } from './logic/user'
import jwt from 'jsonwebtoken'
import { publicUserInfo } from './types'
import cookieParser from 'cookie-parser'

const PORT: number | string = process.env.PORT ?? 5241

const app = express()

// vista para probar los endpoints

app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())

app.get('/', (_, res) => {
  console.log(saludo)
  res.render('index.ejs')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await userLogic.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(500).send({ error: 'Error al crear el usuario' })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    // Obtenemos el usuario confirmado
    const user: publicUserInfo = await userLogic.login({ username, password })

    // Generamos token de usuario
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' })

    res
    // Creamos la cookie del usuario
      .cookie('acces_token', token, {
        httpOnly: true, // La cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
        sameSite: 'strict', // la cookie solo se puede acceder desde el mismo dominio
        maxAge: 1000 * 60 * 60 // el tiempo de duracion de la cookie
      })
      .send({ user })
  } catch (error) {
    res.status(401).send(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})
