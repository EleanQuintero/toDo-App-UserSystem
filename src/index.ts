/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { saludo } from './const'
import { userLogic } from './logic/user'

const PORT: number | string = process.env.PORT ?? 5241

const app = express()

app.use(express.json())

app.get('/', (_, res) => {
  console.log(saludo)
  res.send('Hola node JS desde typescript')
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
    const user = await userLogic.login({ username, password })
    res.send({ user })
  } catch (error) {
    res.status(401).send(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})
