const { Sequelize, Datatypes } = require("sequelize");
const config = require("./config");

const db = {
    Op: Sequelize.Op
};

// Create Sequelize
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD,{
    host: config.HOST,
    dialect: config.DIALECT
});

// Include models

// Relations

// Include a sync option with seed data logic included
db.sync = async () => {
    // Sync schema
    await db.sequelize.sync();

    await seedData();
}