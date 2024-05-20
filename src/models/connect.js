import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

try {
  sequelize.authenticate();
  console.log("Kết nối thành công");
} catch (error) {
  console.log("Kết nối thất bại");
}

export default sequelize;
