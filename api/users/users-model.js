const db = require('../../data/db-config');
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  return await db('users').select('user_id', 'username')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  const key = Object.keys(filter)[0]
  const value = filter[key]

  return await db('users')
    .select('*')
    .where(key, value)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  return await db('users').select('user_id', 'username').where('user_id', user_id).first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [user_id] = await db('users').insert(user)
  return await findById(user_id)
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}