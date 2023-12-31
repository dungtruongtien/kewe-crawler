import Sequelize, { Model } from "sequelize";

class Auth extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          unique: true,
        },
        refreshToken: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
        tableName: 'auth' //Define table name
      }
    );
    return this;
  }
}

export default Auth;