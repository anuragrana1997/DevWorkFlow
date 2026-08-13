import { Sequelize } from "sequelize";
import "dotenv/config";

const dbSequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        pool: {
            max: Number(process.env.DB_CONNECTION_LIMIT) || 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
);

export default dbSequelize;