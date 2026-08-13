import fs from "fs";
import path from "path";
import pool from "../src/config/db.js";
import { fileURLToPath } from "url";
import { Connection } from "mysql2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    const connection = await pool.getConnection();
    try {
        const cleanSQL = fs.readFileSync(
            path.join(__dirname, "clean_seed.sql"),
            "utf8"
        );

        const createSQL = fs.readFileSync(
            path.join(__dirname, "create_seed.sql"),
            "utf8"
        );

        const indexSQL = fs.readFileSync(
            path.join(__dirname, "index_seed.sql"),
            "utf8"
        );

        const dataSQL = fs.readFileSync(
            path.join(__dirname, "data_seed.sql"),
            "utf8"
        );

        await connection.query(cleanSQL);
        await connection.query(createSQL);
        await connection.query(indexSQL);
        await connection.query(dataSQL);
        console.log("Seed Complete")
    } catch (error) {
        console.error(error);
    } finally {
        connection.release();
        await pool.end();
    }
};

seed();