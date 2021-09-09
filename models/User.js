module.exports = (sequelize, DataTypes) => {
const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING
    }
})
return User
}