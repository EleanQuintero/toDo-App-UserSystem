/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { SECRET_KEY } from './const'
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

app.use((req, _, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_KEY)
    req.session.user = data
    console.log(data)
  } catch { }

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index.ejs', user)
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
      .cookie('access_token', token, {
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

app.post('/logout', (_, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'logout sucessfull' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (user === null) {
    console.log(user)
    return res.status(403).send('Acceso no autorizado')
  } else {
    return res.render('protected.ejs', user)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})
