require('dotenv').config()
const express = require('express');
const app = express()
const port = 3000

;(async() => {
  app.use(express.json())

  app.use(require('./middleware/headers'))

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