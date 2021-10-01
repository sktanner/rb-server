const { Sequelize } = require('sequelize');
// removed DataTypes

const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl:{
                    require: true,
                    rejectUnauthorized: false
                }
    }

});

async function syncDb(sequelize, options){
    const { force, alter} = options
    try {
        if (force)
            await sequelize.sync({force: true})
        else if (alter)
            await sequelize.sync({alter: true})
        else
            await sequelize.sync()
    } catch (err){
        console.log(err)
    }
}

module.exports = {
    sequelize,
    syncDb
}