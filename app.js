
/**
 * Users, Profile with collections?, games, notes
 * user has one profile?
 * profile has many games, each game belongs to one profile
 * each game has many notes, note belongs to game
*/


require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

;(async() => {
  app.use(express.json())

  const auth = require('./controllers/Auth')
  app.use("/auth", auth)

//   const post = require('./controllers/Post')
//   app.use('/post', post)

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})()