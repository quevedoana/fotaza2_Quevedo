import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDatabase } from './models/index.js'
import postRoutes from './routes/postRoutes.js'
import session from 'express-session'
import authRoutes from './routes/authRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT

const app = express()

app.use(
  session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use((req,res,next)=>{
  res.locals.currentUser = req.session.user || null
  next()
})

app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index')
})
app.use('/', authRoutes)

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