const { sequelize, syncDb } = require('../db')
const { DataTypes } = require('sequelize')

const UserModel = require('./User')
const GameModel = require('./Game')
const NoteModel = require('./Note')

const User = UserModel(sequelize, DataTypes)
const Game = GameModel(sequelize, DataTypes)
const Note = NoteModel(sequelize, DataTypes)

User.hasMany(Game)
Game.belongsTo(User)

Game.hasMany(Note, {
    onDelete: "CASCADE"
})
Note.belongsTo(Game)

syncDb(sequelize, { alter:true })

module.exports = { User, Game, Note }