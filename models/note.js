module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define("Note", {
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Note
    }