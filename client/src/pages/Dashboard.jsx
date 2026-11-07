import { useEffect, useState } from "react";
import { api } from "../config/api";
import { TaskBoard } from "../components/ticketComponents/TaskBoard";
import { ProjectBoard } from "../components/projectComponents/ProjectBoard";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

export const Dashboard = () => {
    const [view, setView] = useState("tasks");
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [tasksError, setTasksError] = useState("");
    const [projectsError, setProjectsError] = useState("");
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    useEffect(() => {
        api.get("/api/task/assignees").then((response) => setAssignees(response.data.users || [])).catch(() => {});
    }, []);

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
        if (projectsLoaded) return;

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
    }, [projectsLoaded]);

    const createTask = async (data) => {
        const response = await api.post("/api/task/createTask", data);
        if (response.data.task.assignee_id === user?.user_id) setTasks((previous) => [...previous, response.data.task]);
        return response.data.task;
    };

    const updateTask = async (taskId, changes) => {
        await api.patch("/api/task/updateTask", { task_id: taskId, ...changes });
        setTasks((previous) => previous.map((task) => task.task_id === taskId ? { ...task, ...changes } : task)
            .filter((task) => task.assignee_id === user?.user_id));
    };

    const createProject = async (data) => {
        const response = await api.post("/api/project/createProject", data);
        setProjects((previous) => [...previous, response.data.response]);
        return response.data.response;
    };

    const updateProject = async (projectId, changes) => {
        if (changes.project_name !== undefined) {
            await api.patch("/api/project/updateProject", { project_id: projectId, project_name: changes.project_name });
        }
        if (changes.project_status !== undefined) {
            await api.post("/api/project/changeProjectStatus", { project_id: projectId, project_status: changes.project_status });
        }
        setProjects((previous) => previous.map((project) => project.project_id === projectId ? { ...project, ...changes } : project));
    };

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">Workspace</p>
                    <h1>Dashboard</h1>
                    <p>View your assigned tasks and projects.</p>
                    {user?.privilege === 1 && <Link to="/admin">Admin page</Link>}
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
                <TaskBoard tasks={tasks} projects={projects} assignees={assignees} currentUserId={user?.user_id} loading={tasksLoading} error={tasksError}
                    onCreate={createTask} onUpdate={updateTask} />
            ) : (
                <ProjectBoard projects={projects} tasks={tasks} loading={projectsLoading}
                    error={projectsError} tasksLoading={tasksLoading} tasksError={tasksError}
                    canManage={user?.privilege === 1} onCreate={createProject} onUpdate={updateProject} />
            )}
        </main>
    );
};
