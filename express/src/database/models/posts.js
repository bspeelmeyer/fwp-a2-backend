module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "posts",
    {
      post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      post_content: {
        type: DataTypes.STRING(600),
        allowNull: false,
      },
      image: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      parent_post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      // Don't add timestamp attribute
      timestamps: false,
    }
  );
