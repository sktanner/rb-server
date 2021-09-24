const router = require("express").Router()
// const { query } = require("express")
let validateJWT = require("../middleware/validate-jwt")
const { Note, Game } = require("../models")


/* Note Create */
router.post("/:id/create", validateJWT, async (req, res) => {
    let message

    try {
        let game = await Game.findOne({where: { id: req.params.id}})

        if (game) {
            let note = await game.createNote({ content: req.body.content })
            await game.addNote(note)

            message = {message: 'Note created successfully', data: note }
        } 
        else {
            message = {message: "Game does not exist", data: null}
        }
    } catch(err) {
        // console.log(err);
        message = {message: "Note create failed"}
    }

    res.json(message)
})


/* Get all Notes by Game */
router.get("/:id", validateJWT, async (req, res) => {
    let game = await Game.findOne({where: { id: req.params.id}})
    let notes = game ? await game.getNotes() : null
    if (notes){
        let cleaned_notes = notes.map( p => {
                    const { content, id } = p
                    return { content, id }
        })

        res.status(200).json(cleaned_notes)
    }
    else
        res.send(notes)
})


/* Note Update */
router.put("/:id", validateJWT, async (req, res) => {
    const noteId = req.params.id

    const updatedNote = { content: req.body.content }

        const update = await Note.update(updatedNote, {where: {id: noteId}})
        console.log(update);
        res.json(updatedNote)
})


/* Note Delete */
router.delete("/:id", validateJWT, async (req, res) => {
    const noteId = req.params.id

        const query = { where: { id: noteId } }

        await Note.destroy(query)
        res.json({ message: "Note Removed" })
})

module.exports = router;