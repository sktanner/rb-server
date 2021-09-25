module.exports = (sequelize, DataTypes) => {
const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.STRING,
        defaultValue: "false"
    }
})
return User
}