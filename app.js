import 'dotenv/config'
import express from 'express'

const PORT = process.env.PORT

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', (req,res) =>{
    res.render('index')
})

app.get('/login', (req,res) =>{
    res.render('login')
})

app.get('/registro', (req,res) =>{
    res.render('register')
})

app.listen(PORT, (err)=>{
    if(err){
        console.error('error al iniciar el servidor:', err)
        return
    }
    console.log(`servidor escuchando en el puerto ${PORT}`)
})