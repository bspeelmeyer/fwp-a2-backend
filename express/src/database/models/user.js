module.exports = (sequelize, DataTypes) =>
    sequelize.define("user", {
        user_name: {
            type: DataTypes.STRING(32),
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING(96),
            allowNull: false
        }
    }, {
        // Don't add timestamp attribute
        timestamps: false
    });