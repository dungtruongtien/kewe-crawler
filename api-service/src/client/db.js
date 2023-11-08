import { Sequelize } from "sequelize";
import config from "../config/init";
import fs from "fs";

const modelFiles = fs
  .readdirSync(__dirname + "/../models/")
  .filter((file) => file.endsWith(".js"));

const sequelizeService = {
  init: async () => {
    try {
      let connection = new Sequelize({
        dialect: config.dialect,
        port: config.dbPort,
        host: config.dbHost,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        define: {
          timestamps: true
        },
      });

      // Testing connection
      await connection.authenticate();

      // Loading models automatically
      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);
        model.default.init(connection);
      }

      modelFiles.map(async (file) => {
        const model = await import(`../models/${file}`);
        model.default.associate && model.default.associate(connection.models);
      });

      // Only force sync in develop
      if (process.env.NODE_ENV === 'development') {
        await connection.sync({ force: true });
      }

      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;