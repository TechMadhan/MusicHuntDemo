const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios');
const User = require('../models/User')
var request = require('request');

users.use(cors())

process.env.SECRET_KEY = 'secret'


users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName  :req.body.userName,
    email: req.body.email,
    password: req.body.password,
    profile_img : req.body.profile_img,
    created: today
  }

  User.findOne({
    userName: req.body.userName
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              res.json({ status: user.email + 'Registered!' })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/login', (req, res) => {
  User.findOne({
    userName: req.body.userName
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Passwords match
          const payload = {
            _id: user._id,
            firstName: user.firstName,
            last_name: user.lastName,
            email: user.email
          }
          let userDetails = {
            userName : user.userName,
            profile_img : user.profile_img
          }
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send({token : token, userDetails : userDetails})
        } else {
          // Passwords don't match
          res.json({ error: 'Password Incorect' })
        }
      } else {
        res.json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})


users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (user) {
        console.log(user);
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = users
