const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

// Include models
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.posts = require("./models/posts.js")(db.sequelize, DataTypes);
db.follows = require("./models/follows.js")(db.sequelize, DataTypes);
db.liked_posts = require("./models/liked_posts.js")(db.sequelize, DataTypes);

// Relate post and user
db.posts.belongsTo(db.user, {
  foreignKey: { name: "user_name", allowNull: false },
});

// Relate user to user to implement follow function
db.user.belongsToMany(db.user, {
  foreignKey: "follower",
  as: "follower",
  through: db.follows,
});
db.user.belongsToMany(db.user, {
  foreignKey: "followed",
  as: "followed",
  through: db.follows,
});

// Relate posts to user to implement liked post function
db.posts.belongsToMany(db.user, {
  foreignKey: "post",
  as: "post",
  through: db.liked_posts,
});
db.user.belongsToMany(db.posts, {
  foreignKey: "liked_by",
  as: "liked_by",
  through: db.liked_posts,
});

// Include a sync option with seed data logic included
db.sync = async () => {
  // Sync schema
  await db.sequelize.sync();
};

module.exports = db;
