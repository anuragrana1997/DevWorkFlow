import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

// sample
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// auth 
app.use("/api/auth", authRoutes);
export default app;