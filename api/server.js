const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
//const Store = require('connect-session-knex')(session)
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session({
  name: 'chocolatechip',
  secret: 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  // store: new Store({
  //   knex: require('../data/db-config'),
  //   tablename: 'sessions',
  //   sidfieldname: 'sid',
  //   createTable: true,
  //   clearInterval: 1000 * 60 * 60,
  // })
}))

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
