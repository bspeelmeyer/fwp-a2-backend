const user = require("./user");
const posts = require("./posts");

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "liked_posts",
    {
      liked_by: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        references: {
          model: user,
          key: "user_name",
        },
      },
      liked: {
        type: DataTypes.INTEGER,
      },
      disliked: {
        type: DataTypes.INTEGER,
      },
      post: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: posts,
          key: "post_id",
        },
      },
    },
    {
      timestamps: false,
    }
  );
