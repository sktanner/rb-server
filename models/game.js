module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define("Game", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        thumb_url: {
            type: DataTypes.STRING
        },
        collection: {
            type: DataTypes.STRING
        }
    })
    return Game
}