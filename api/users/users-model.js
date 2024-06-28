const db = require('../../data/db-config');

async function find() {
  return await db('users').select('user_id', 'username')
}

async function findBy(filter) {
  const key = Object.keys(filter)[0]
  const value = filter[key]

  return await db('users')
    .select('*')
    .where(key, value)
}

async function findById(user_id) {
  return await db('users').select('user_id', 'username').where('user_id', user_id).first()
}

async function add(user) {
  const [user_id] = await db('users').insert(user)
  return await findById(user_id)
}

module.exports = {
  find,
  findBy,
  findById,
  add
}