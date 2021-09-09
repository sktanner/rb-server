const { sequelize, synceDb } = require('../db')
const { DataTypes } = require('sequelize')

const DefineUser = require('./User')
// const DefinePost = require('./Post')

const User = DefineUser(sequelize, DataTypes)
// const Post = DefinePost(sequelize, DataTypes)

// User.hasMany(Game)
// Game.belongsTo(User)

synceDb(sequelize, { alter:true })


module.exports = { User }