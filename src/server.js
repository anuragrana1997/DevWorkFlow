import "dotenv/config";
import pool from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("Mysql Connected");
        connection.release();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

startServer();