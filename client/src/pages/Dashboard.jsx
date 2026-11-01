import { useEffect, useState } from "react";
import { api } from "../config/api";
import { TaskBoard } from "../components/ticketComponents/TaskBoard";
import { ProjectBoard } from "../components/projectComponents/ProjectBoard";
import "../styles/Dashboard.css";

export const Dashboard = () => {
    const [view, setView] = useState("tasks");
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [tasksError, setTasksError] = useState("");
    const [projectsError, setProjectsError] = useState("");
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadTasks = async () => {
            try {
                const response = await api.get("/api/task/getAllTasks", {
                    signal: controller.signal
                });
                setTasks(response.data.task || []);
            } catch (error) {
                if (error.code !== "ERR_CANCELED") {
                    setTasksError(error.response?.data?.message || "Unable to load tasks.");
                }
            } finally {
                if (!controller.signal.aborted) setTasksLoading(false);
            }
        };

        loadTasks();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (view !== "projects" || projectsLoaded) return;

        const controller = new AbortController();

        const loadProjects = async () => {
            setProjectsLoading(true);
            setProjectsError("");
            try {
                const response = await api.get("/api/project/getAllProjects", {
                    signal: controller.signal
                });
                setProjects(response.data.response || []);
                setProjectsLoaded(true);
            } catch (error) {
                if (error.code !== "ERR_CANCELED") {
                    setProjectsError(error.response?.data?.message || "Unable to load projects.");
                }
            } finally {
                if (!controller.signal.aborted) setProjectsLoading(false);
            }
        };

        loadProjects();
        return () => controller.abort();
    }, [view, projectsLoaded]);

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">Workspace</p>
                    <h1>Dashboard</h1>
                    <p>View your assigned tasks and projects.</p>
                </div>
                <div className="dashboard-toggle" role="group" aria-label="Dashboard view">
                    <button type="button" className={view === "tasks" ? "active" : ""}
                        aria-pressed={view === "tasks"} onClick={() => setView("tasks")}>
                        Tasks
                    </button>
                    <button type="button" className={view === "projects" ? "active" : ""}
                        aria-pressed={view === "projects"} onClick={() => setView("projects")}>
                        Projects
                    </button>
                </div>
            </header>

            {view === "tasks" ? (
                <TaskBoard tasks={tasks} loading={tasksLoading} error={tasksError} />
            ) : (
                <ProjectBoard projects={projects} tasks={tasks} loading={projectsLoading}
                    error={projectsError} tasksLoading={tasksLoading} tasksError={tasksError} />
            )}
        </main>
    );
};
