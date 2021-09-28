const router = require("express").Router()
const { query } = require("express")
let validateJWT = require("../middleware/validate-jwt")
const { Game, User } = require("../models")


/* Game Create */
router.post("/create", validateJWT, async (req, res) => {
    let message

    try {
        let u = await User.findOne({where: { id: req.user.id}})

        if (u) {
            let game = await u.createGame({
                name: req.body.name,
                description: req.body.description,
                thumb_url: req.body.thumb_url,
                collection: req.body.collection
            })
            await u.addGame(game)

            message = {message: 'Game created successfully', data: game }
        } 
        else {
            message = {message: "User does not exist", data: null}
        }
    } catch(err) {
        console.log(err);
        message = {message: "Game create failed", error: err}
    }

    res.json(message)
})


/* Get all Games by User */
router.get("/", validateJWT, async (req, res) => {
    let u = await User.findOne({where: { id: req.user.id}})
    let games = u ? await u.getGames() : null
    if (games){
        let cleaned_games = games.map( p => {
                    const { name, description, thumb_url, id, collection } = p
                    return { name, description, thumb_url, id, collection }
        })

        res.send(cleaned_games)
    }
    else
        res.send(games)
})


/* Game Update */
router.put("/:id", validateJWT, async (req, res) => {
    const {name, description, thumb_url, collection} = req.body
    const gameId = req.params.id

    const updatedGame = {
        name: name,
        description: description,
        thumb_url: thumb_url,
        collection: collection
    }

        const update = await Game.update(updatedGame, {where: {id: gameId}})
        console.log(update);
        res.json(updatedGame)
})


/* Game Delete */
router.delete("/:id", validateJWT, async (req, res) => {
    const gameId = req.params.id

        const query = {
            where: {
                id: gameId
            }
        }

        await Game.destroy(query)
        res.json({ message: "Game Removed" })
})

module.exports = router;