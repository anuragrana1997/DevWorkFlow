import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

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
app.use("/api/user", userRoutes);
app.use("/api/project", projectRouter)

export default app;