const { sequelize, synceDb } = require('../db')
const { DataTypes } = require('sequelize')

const UserModel = require('./user')
const GameModel = require('./game')
const NoteModel = require('./note')

const User = UserModel(sequelize, DataTypes)
const Game = GameModel(sequelize, DataTypes)
const Note = NoteModel(sequelize, DataTypes)

User.hasMany(Game)
Game.belongsTo(User)
Game.hasMany(Note)
Note.belongsTo(Game)

// synceDb(sequelize, { alter:true })

module.exports = { User, Game, Note }