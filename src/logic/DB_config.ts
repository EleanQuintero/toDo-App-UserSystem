import mysql from 'mysql2/promise'

// Definimos los parametros de las conexiones
const DB_HOST = process.env.DB_HOST ?? 'localhost'
const DB_USER = process.env.DB_USER ?? 'root'
const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
const DB_PORT: number = parseInt(process.env.DB_PORT ?? '3306', 10)
const DB_NAME = process.env.DB_NAME ?? 'TodosDB'

// creamos nuestro objeto de configuracion para la conexion
const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME
}

// Creamos conexion con DB
export const connection = mysql.createConnection(config)
