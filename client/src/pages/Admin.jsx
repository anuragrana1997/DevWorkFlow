import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../config/api";
import { taskStatuses, projectStatuses } from "../config/statuses";
import "../styles/Dashboard.css";
import "../styles/Admin.css";

const emptyTask = { task_heading: "", task_description: "", task_priority: 0, task_status: 0, project_id: "", assignee_id: "" };
const emptyProject = { project_name: "", project_status: 0 };
const nameOf = (user) => `${user.first_name} ${user.last_name}`.trim();
const messageOf = (error) => error.response?.data?.message || "Request failed. Please try again.";

export const Admin = () => {
    const [data, setData] = useState({ users: [], projects: [], memberships: [], tasks: [] });
    const [accessDenied, setAccessDenied] = useState(false);
    const [tab, setTab] = useState("members");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState(false);
    const [task, setTask] = useState(emptyTask);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [project, setProject] = useState(emptyProject);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [newMemberId, setNewMemberId] = useState("");

    const refresh = useCallback(async () => {
        const response = await api.get("/api/admin/overview");
        setData(response.data);
    }, []);

    useEffect(() => {
        let live = true;
        api.get("/api/admin/overview").then((response) => {
            if (live) setData(response.data);
        }).catch((requestError) => {
            if (live) {
                if (requestError.response?.status === 403) setAccessDenied(true);
                else setError(messageOf(requestError));
            }
        }).finally(() => { if (live) setLoading(false); });
        return () => { live = false; };
    }, []);

    const run = async (action, success) => {
        setBusy(true);
        setError("");
        setNotice("");
        try {
            await action();
            await refresh();
            setNotice(success);
            return true;
        } catch (requestError) {
            setError(messageOf(requestError));
            return false;
        } finally { setBusy(false); }
    };

    const activeUsers = data.users.filter((user) => user.is_active !== 0);
    const selectedProject = data.projects.find((item) => item.project_id === Number(selectedProjectId));
    const projectMembers = data.memberships.filter((item) => item.project_id === selectedProject?.project_id);
    const memberIds = new Set(projectMembers.map((item) => item.user_id));

    const saveTask = async (event) => {
        event.preventDefault();
        const payload = { ...task, task_heading: task.task_heading.trim(), project_id: task.project_id ? Number(task.project_id) : null,
            assignee_id: task.assignee_id ? Number(task.assignee_id) : null };
        const saved = await run(() => editingTaskId ? api.patch(`/api/admin/tasks/${editingTaskId}`, payload) : api.post("/api/admin/tasks", payload),
            editingTaskId ? "Task updated." : "Task created.");
        if (saved) { setTask(emptyTask); setEditingTaskId(null); }
    };

    const saveProject = async (event) => {
        event.preventDefault();
        const payload = { ...project, project_name: project.project_name.trim() };
        const saved = await run(() => editingProjectId ? api.patch(`/api/admin/projects/${editingProjectId}`, payload) : api.post("/api/admin/projects", payload),
            editingProjectId ? "Project updated." : "Project created.");
        if (saved) { setProject(emptyProject); setEditingProjectId(null); }
    };

    if (accessDenied) return <main className="dashboard admin-page"><h1>Admin access required</h1><Link to="/dashboard">Back to dashboard</Link></main>;

    return <main className="dashboard admin-page">
        <header className="dashboard-header">
            <div><p className="dashboard-eyebrow">Workspace administration</p><h1>Admin</h1>
                <p>Manage members, tasks, projects, and project access.</p><Link to="/dashboard">Back to dashboard</Link></div>
        </header>
        <nav className="dashboard-toggle admin-tabs" aria-label="Admin sections">
            {[["members", "Members"], ["tasks", "Tasks"], ["projects", "Projects"], ["project-members", "Project members"]].map(([key, label]) =>
                <button key={key} type="button" className={tab === key ? "active" : ""} aria-current={tab === key ? "page" : undefined}
                    onClick={() => { setTab(key); setError(""); setNotice(""); }}>{label}</button>)}
        </nav>
        {loading && <p role="status">Loading administration data...</p>}
        {error && <p className="panel-error" role="alert">{error}</p>}
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        {!loading && tab === "members" && <section className="admin-panel">
            <h2>Members</h2>
            <p>Removing a member deactivates their account.</p>
            <div className="admin-list">{data.users.map((user) => <div className="admin-row" key={user.user_id}>
                <div><strong>{nameOf(user)}</strong><small>{user.email} · {user.is_active === 0 ? "Inactive" : `User #${user.user_id}`}</small></div>
                <label>Privilege <select aria-label={`Privilege for ${nameOf(user)}`} value={user.privilege ?? 2} disabled={busy || user.is_active === 0}
                    onChange={(event) => run(() => api.patch(`/api/admin/users/${user.user_id}`, { privilege: Number(event.target.value) }), "Privilege updated.")}>
                    <option value={1}>Admin</option><option value={2}>Member</option><option value={3}>Viewer</option>
                </select></label>
                <button type="button" className="admin-danger" disabled={busy || user.is_active === 0} onClick={() => {
                    if (window.confirm(`Remove ${nameOf(user)} from the workspace?`)) run(() => api.delete(`/api/admin/users/${user.user_id}`), "Member removed.");
                }}>Remove</button>
            </div>)}</div>
        </section>}
        {!loading && tab === "tasks" && <section className="admin-panel">
            <h2>{editingTaskId ? `Edit task #${editingTaskId}` : "Create task"}</h2>
            <form className="dashboard-form admin-form" onSubmit={saveTask}>
                <label>Title<input required maxLength={255} value={task.task_heading} onChange={(event) => setTask({ ...task, task_heading: event.target.value })} /></label>
                <label>Description<textarea value={task.task_description || ""} onChange={(event) => setTask({ ...task, task_description: event.target.value })} /></label>
                <label>Project<select value={task.project_id ?? ""} onChange={(event) => setTask({ ...task, project_id: event.target.value })}>
                    <option value="">No project</option>{data.projects.map((item) => <option key={item.project_id} value={item.project_id}>{item.project_name}</option>)}
                </select></label>
                <label>Assignee<select value={task.assignee_id ?? ""} onChange={(event) => setTask({ ...task, assignee_id: event.target.value })}>
                    <option value="">Unassigned</option>
                    {task.assignee_id && !activeUsers.some((user) => user.user_id === Number(task.assignee_id)) && <option value={task.assignee_id}>Inactive member #{task.assignee_id}</option>}
                    {activeUsers.map((user) => <option key={user.user_id} value={user.user_id}>{nameOf(user)}</option>)}
                </select></label>
                <label>Priority<select value={task.task_priority} onChange={(event) => setTask({ ...task, task_priority: Number(event.target.value) })}>
                    <option value={0}>Low</option><option value={1}>Medium</option><option value={2}>High</option>
                </select></label>
                <label>Status<select value={task.task_status} onChange={(event) => setTask({ ...task, task_status: Number(event.target.value) })}>
                    {taskStatuses.map((label, index) => <option key={label} value={index}>{label}</option>)}
                </select></label>
                <div className="admin-actions"><button type="submit" disabled={busy || !task.task_heading.trim()}>{editingTaskId ? "Save task" : "Create task"}</button>
                    {editingTaskId && <button type="button" onClick={() => { setTask(emptyTask); setEditingTaskId(null); }}>Cancel edit</button>}</div>
            </form>
            <h2>All tasks</h2><div className="admin-list">{data.tasks.map((item) => <div className="admin-row" key={item.task_id}>
                <div><strong>#{item.task_id} {item.task_heading}</strong><small>{data.projects.find((p) => p.project_id === item.project_id)?.project_name || "No project"} · {nameOf(data.users.find((u) => u.user_id === item.assignee_id) || { first_name: "Unassigned", last_name: "" })} · {taskStatuses[item.task_status]}</small></div>
                <button type="button" disabled={busy} onClick={() => { setEditingTaskId(item.task_id); setTask({ task_heading: item.task_heading, task_description: item.task_description || "", task_priority: item.task_priority ?? 0, task_status: item.task_status ?? 0, project_id: item.project_id ?? "", assignee_id: item.assignee_id ?? "" }); }}>Edit</button>
                <button type="button" className="admin-danger" disabled={busy} onClick={() => {
                    if (window.confirm(`Delete task #${item.task_id} and its comments and activity logs?`)) run(() => api.delete(`/api/admin/tasks/${item.task_id}`), "Task deleted.");
                }}>Delete</button>
            </div>)}{data.tasks.length === 0 && <p>No tasks yet.</p>}</div>
        </section>}
        {!loading && tab === "projects" && <section className="admin-panel">
            <h2>{editingProjectId ? `Edit project #${editingProjectId}` : "Create project"}</h2>
            <form className="dashboard-form admin-form" onSubmit={saveProject}>
                <label>Name<input required maxLength={255} value={project.project_name} onChange={(event) => setProject({ ...project, project_name: event.target.value })} /></label>
                <label>Status<select value={project.project_status} onChange={(event) => setProject({ ...project, project_status: Number(event.target.value) })}>
                    {projectStatuses.map((label, index) => <option key={label} value={index}>{label}</option>)}
                </select></label>
                <div className="admin-actions"><button type="submit" disabled={busy || !project.project_name.trim()}>{editingProjectId ? "Save project" : "Create project"}</button>
                    {editingProjectId && <button type="button" onClick={() => { setProject(emptyProject); setEditingProjectId(null); }}>Cancel edit</button>}</div>
            </form>
            <h2>All projects</h2><div className="admin-list">{data.projects.map((item) => <div className="admin-row" key={item.project_id}>
                <div><strong>#{item.project_id} {item.project_name}</strong><small>{projectStatuses[item.project_status]}</small></div>
                <button type="button" disabled={busy} onClick={() => { setEditingProjectId(item.project_id); setProject({ project_name: item.project_name, project_status: item.project_status }); }}>Edit</button>
                <button type="button" className="admin-danger" disabled={busy} onClick={() => {
                    if (window.confirm(`Delete project ${item.project_name}? It must have no tasks.`)) run(() => api.delete(`/api/admin/projects/${item.project_id}`), "Project deleted.");
                }}>Delete</button>
            </div>)}{data.projects.length === 0 && <p>No projects yet.</p>}</div>
        </section>}
        {!loading && tab === "project-members" && <section className="admin-panel">
            <h2>Project members</h2>
            <label className="admin-project-select">Project <select value={selectedProjectId} onChange={(event) => { setSelectedProjectId(event.target.value); setNewMemberId(""); }}>
                <option value="">Select a project</option>{data.projects.map((item) => <option key={item.project_id} value={item.project_id}>{item.project_name}</option>)}
            </select></label>
            {selectedProject && <>
                <form className="dashboard-form admin-form" onSubmit={async (event) => {
                    event.preventDefault();
                    if (await run(() => api.post(`/api/admin/projects/${selectedProject.project_id}/members`, { member_id: Number(newMemberId) }), "Member added to project.")) setNewMemberId("");
                }}>
                    <label>Add member<select required value={newMemberId} onChange={(event) => setNewMemberId(event.target.value)}>
                        <option value="">Select a member</option>{activeUsers.filter((user) => !memberIds.has(user.user_id)).map((user) =>
                            <option key={user.user_id} value={user.user_id}>{nameOf(user)}</option>)}
                    </select></label><button type="submit" disabled={busy || !newMemberId}>Add to project</button>
                </form>
                <div className="admin-list">{projectMembers.map((membership) => {
                    const user = data.users.find((item) => item.user_id === membership.user_id);
                    return <div className="admin-row" key={membership.user_id}><div><strong>{user ? nameOf(user) : `User #${membership.user_id}`}</strong>
                        <small>{user?.email || "Unknown user"}</small></div>
                        <button type="button" className="admin-danger" disabled={busy} onClick={() => {
                            if (window.confirm(`Remove ${user ? nameOf(user) : "this user"} from ${selectedProject.project_name}?`))
                                run(() => api.delete(`/api/admin/projects/${selectedProject.project_id}/members/${membership.user_id}`), "Member removed from project.");
                        }}>Remove</button></div>;
                })}{projectMembers.length === 0 && <p>No members in this project.</p>}</div>
            </>}
        </section>}
    </main>;
};
