
/**
 * Users, Profile with collections?, games, notes
 * user has one profile?
 * profile has many games, each game belongs to one profile
 * each game has many notes, note belongs to game
*/


require('dotenv').config()
const express = require('express');
const app = express()
const port = 3000

;(async() => {
  app.use(express.json())

  const user = require('./controllers/userController')
  app.use("/user", user)

  const game = require('./controllers/gameController')
  app.use('/game', game)

  const note = require('./controllers/noteController')
  app.use('/note', note)

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
})()