import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDatabase } from './models/index.js'
import postRoutes from './routes/postRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT

const app = express()

app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/registro', (req, res) => {
  res.render('register')
})

app.use('/publicaciones', postRoutes)

connectDatabase()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.error('error al iniciar el servidor:', err)
        return
      }
      console.log(`servidor escuchando en el puerto ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("error al sincronizar bd", err)
  })