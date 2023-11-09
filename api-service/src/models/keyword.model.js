import Sequelize, { Model } from "sequelize";

class Keyword extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: Sequelize.INTEGER,
        totalAdWordsAdvertisers: Sequelize.INTEGER,
        totalLinks: Sequelize.INTEGER,
        searchResult: Sequelize.INTEGER,
        htmlStaticLink: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
        tableName: 'keyword' //Define table name
      }
    );
    return this;
  }
}

export default Keyword;