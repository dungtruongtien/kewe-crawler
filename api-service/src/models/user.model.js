import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        dob: Sequelize.DATE,
      },
      {
        sequelize,
        timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
        tableName: 'Users' //Define table name
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.belongsToMany(models.Address, {
  //     through: "UserAddress",
  //     foreignKey: "userId",
  //   });
  // }
}

export default User;