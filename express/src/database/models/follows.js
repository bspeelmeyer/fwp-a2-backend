const user = require("./user");

// Model determines the table, relative to
// the user many to many relation
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "follows",
    {
      follower: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        references: {
          model: user,
          key: "user_name",
        },
      },
      followed: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        references: {
          model: user,
          key: "user_name",
        },
      },
    },
    {
      timestamps: false,
    }
  );
