const express = require('express')
const tracks = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios');
const Track = require('../models/Track')

tracks.use(cors())

process.env.SECRET_KEY = 'secret'

// users.post('/register', (req, res) => {
//   const today = new Date()
//   const userData = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     userName  :req.body.userName,
//     email: req.body.email,
//     password: req.body.password,
//     created: today
//   }
//
//   User.findOne({
//     userName: req.body.userName
//   })
//     .then(user => {
//       if (!user) {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           userData.password = hash
//           User.create(userData)
//             .then(user => {
//               res.json({ status: user.email + 'Registered!' })
//             })
//             .catch(err => {
//               res.send('error: ' + err)
//             })
//         })
//       } else {
//         res.json({ error: 'User already exists' })
//       }
//     })
//     .catch(err => {
//       res.send('error: ' + err)
//     })
// })
//
// users.post('/login', (req, res) => {
//   User.findOne({
//     userName: req.body.userName
//   })
//     .then(user => {
//       if (user) {
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//           // Passwords match
//           const payload = {
//             _id: user._id,
//             firstName: user.firstName,
//             last_name: user.lastName,
//             email: user.email
//           }
//           let token = jwt.sign(payload, process.env.SECRET_KEY, {
//             expiresIn: 1440
//           })
//           res.send(token)
//         } else {
//           // Passwords don't match
//           res.json({ error: 'Password Incorect' })
//         }
//       } else {
//         res.json({ error: 'User does not exist' })
//       }
//     })
//     .catch(err => {
//       res.send('error: ' + err)
//     })
// })


module.exports = tracks
