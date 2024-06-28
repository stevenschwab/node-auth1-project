const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../users/users-model')
const { 
  checkUsernameFree, 
  checkUsernameExists, 
  checkPasswordLength 
} = require('./auth-middleware')

router.post(
  '/register', 
  checkUsernameFree, 
  checkPasswordLength, 
  async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcryptjs.hashSync(password, 8)
    const newUser = { username, password: hash }
    const result = await User.add(newUser)
    res.status(200).json({ user_id: result.user_id, username: result.username })
  } catch (err) {
    next(err)
  }
})

router.post(
  '/login', 
  checkUsernameExists, 
  async (req, res, next) => {
  try {
    const { username, password } = req.body
    const [user] = await User.findBy({ username })

    if (user && bcryptjs.compareSync(password, user.password)) {
      req.session.user = user
      res.json({ message: `Welcome ${user.username}!`})
    } else {
      next({ status: 401, message: "Invalid credentials" })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    const { username } = req.session.user
    req.session.destroy(err => {
      if (err) {
        res.json({ message: `you can never leave, ${username}`})
      } else {
        res.clearCookie('chocolatechip')
        res.json({ message: "logged out" })
      }
    })
  } else {
    next({ status: 200, message: "no session" })
  }
})

module.exports = router