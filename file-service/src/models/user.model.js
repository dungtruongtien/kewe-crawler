import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        dob: Sequelize.DATE,
      },
      {
        sequelize,
        timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
        tableName: 'user' //Define table name
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Auth, {
      foreignKey: "userId",
    });

    this.hasMany(models.Keyword, {
      foreignKey: "userId",
    });
  }
}

export default User;