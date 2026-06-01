import bcrypt from 'bcrypt'
import { User } from '../models/index.js'

export const getLogin = (req, res) => {
  res.render('login')
}

export const getRegister = (req, res) => {
  res.render('register')
}

export const postRegister = async (req, res) => {
  try {
    const {
      email,
      password,
      fecha,
      nombre,
      usuario,
    } = req.body

    const existe = await User.findOne({
      where: { email }
    })

    if (existe) {
      return res.send('Ya existe un usuario con ese email')
    }

    const hash = await bcrypt.hash(password, 10)

    await User.create({
      email,
      password: hash,
      birthDate: fecha,
      fullName: nombre,
      userName: usuario,
    })

    res.redirect('/login')

  } catch (err) {
    console.error(err)
    res.redirect('/registro')
  }
}

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      return res.send('Usuario no encontrado')
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    )

    if (!validPassword) {
      return res.send('Contraseña incorrecta')
    }

    req.session.user = {
      idUser: user.idUser,
      userName: user.userName,
    }

    res.redirect('/publicaciones')

  } catch (err) {
    console.error(err)
    res.redirect('/login')
  }
}

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}