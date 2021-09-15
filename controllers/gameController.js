const router = require("express").Router()
let validateJWT = require("../middleware/validate-jwt")
const { Game, User } = require("../models")

/* Game Create */
router.post("/create", validateJWT, async (req, res) => {
    let message

    try {
        let u = await User.findOne({where: { id: req.user.id}})

        if (u) {
            let game = await u.createGame({
                title: req.body.title,
                description: req.body.description,
                categories: req.body.categories,
                image: req.body.image
            })
            await u.addGame(game)

            message = {message: 'Game created successfully', data: game }
        } 
        else {
            message = {message: "User does not exist", data: null}
        }
    } catch(err) {
        // console.log(err);
        message = {message: "Game create failed"}
    }

    res.json(message)
})


/* Get all Games by User */
router.get("/", validateJWT, async (req, res) => {
    let u = await User.findOne({where: { id: req.user.id}})
    let games = u ? await u.getGames() : null
    if (games){
        let cleaned_games = games.map( p => {
                    const { title, description, categories, image } = p
                    return { title, description, categories, image }
        })

        res.send(cleaned_games)
    }
    else
        res.send(games)
})


/* Game Update */
router.put("/:id", validateJWT, async (req, res) => {
    const {title, description, categories, image} = req.body
    const gameId = req.params.id

    const updatedGame = {
        title: title,
        description: description,
        categories: categories,
        image: image
    }

        const update = await Game.update(updatedGame, {where: {id: gameId}})
        console.log(update);
        res.json(updatedGame)
})




/* Game Delete */

router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id
    const gameId = req.params.id

    try {
        const query = {
            where: {
                id: gameId,
                owner: ownerId
            }
        }

        await Game.destroy(query)
        res.status(200).json({ message: "Game Removed" })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router;