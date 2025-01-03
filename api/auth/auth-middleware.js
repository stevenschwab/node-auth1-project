const User = require('../users/users-model')

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: "You shall not pass!" })
  }
}

async function checkUsernameFree(req, res, next) {
  const users = await User.findBy({ username: req.body.username })

  if (users.length) {
    next({ status: 422, message: "Username taken" })
  } else {
    next()
  }
}

async function checkUsernameExists(req, res, next) {
  const [user] = await User.findBy({ username: req.body.username })

  if (user) {
    next()
  } else {
    next({ status: 401, message: "Invalid credentials" })
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body

  if (
    password == null || 
    typeof password !== 'string' || 
    password.trim().length <= 3
  ) {
    next({ status: 422, message: "Password must be longer than 3 chars" })
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}