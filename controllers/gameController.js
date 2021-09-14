const router = require("express").Router()
let validateJWT = require("../middleware/validate-jwt")
const { Game, User } = require("../models")

/* Game Create */
router.post("/create", validateJWT, async (req, res) => {
    let message
    // const {title, description, categories, image} = req.body.game
    // const userId = req.user.id
    try {
        let u = await User.findOne({where: { id: req.user.id}})
        console.log(u)
        if (u) {
            console.log('hitting try block?')
            let game = await u.createGame({
                title: req.body.title,
                description: req.body.description,
                categories: req.body.categories,
                image: req.body.image
            })
            await u.addGame(game)

            message = {message: 'Game created successfully.', data: game }


            // res.status(200).json({ message: 'Game created successfully.', game })
            // res.json(game)
            console.log(game)
            // let { id, title, description, categories, image } = await Game.findOne({ where: { id: game.id }})
            // message = {message: "Game created", data: { id, title, description, categories, image }}
        } 
        else {
            message = {message: "User does not exist", data: null}
        }
    } catch(err) {
        message = {message: "Game create failed"}
    }

    res.json(message)
})


/* Get all Games by User */
router.get("/", validateJWT, async (req, res) => {
    const {id} = req.user
    try {
        const userGames = await Game.findAll({
            where: { owner: id }
        })
        res.status(200).json(userGames)
    } catch (err) {
        res.status(500).json({error:err})
    }
})


/* Game Update */
router.put("/:id", validateJWT, async (req, res) => {
    const {title, description, categories, image} = req.body.game
    const gameId = req.params.id
    const userId = req.user.id

    const query = {
        where: {
            id: gameId,
            owner: userId
        }
    }

    const updatedGame = {
        title: title,
        description: description,
        categories: categories,
        image: image
    }

    try {
        const update = await Game.update(updatedGame, query)
        res.status(200).json(updatedGame)
    } catch (err) {
        res.status(500).json({ error: err })
    }
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