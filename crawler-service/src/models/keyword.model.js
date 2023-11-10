import Sequelize, { Model } from "sequelize";

class Keyword extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: Sequelize.INTEGER,
        totalAdWordsAdvertisers: Sequelize.INTEGER,
        adWordsAdvertisers: Sequelize.JSON,
        totalLinks: Sequelize.INTEGER,
        links: Sequelize.JSON,
        searchResultStatistics: Sequelize.STRING,
        htmlStaticLink: Sequelize.STRING,
        keyword: Sequelize.STRING,
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