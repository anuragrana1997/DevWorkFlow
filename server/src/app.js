import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import activityLogRouter from "./routes/activityLogRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import taskHistoryRouter from "./routes/taskHistoryRoutes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

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
app.use("/api/project", projectRouter);
app.use("/api/task", taskRouter);
app.use("/api/comment", commentRouter);
app.use("/api/activitLog", activityLogRouter);
app.use("/api/admin", adminRouter);
app.use("/api/task", taskHistoryRouter);

export default app;
