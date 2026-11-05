import { useState } from "react";
import { projectStatuses } from "../../config/statuses";

export const ProjectDetails = ({ project, tasks, tasksLoading, tasksError, canManage, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(project.project_name);
    const [status, setStatus] = useState(project.project_status);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const save = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await onUpdate(project.project_id, { project_name: name.trim() });
            setEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update project.");
        } finally {
            setSaving(false);
        }
    };

    const changeStatus = async (event) => {
        const nextStatus = Number(event.target.value);
        setStatus(nextStatus);
        setError("");
        try {
            await onUpdate(project.project_id, { project_status: nextStatus });
        } catch (error) {
            setStatus(project.project_status);
            setError(error.response?.data?.message || "Unable to update status.");
        }
    };

    return <div className="project-details">
        <div className="detail-heading"><p className="detail-overline">Project #{project.project_id}</p>
            {canManage && <button type="button" className="text-button" onClick={() => {
                if (editing) setName(project.project_name);
                setEditing(!editing);
            }}>
                {editing ? "Cancel" : "Edit project"}</button>}</div>
        <h2>{project.project_name}</h2>
        <div className="detail-meta">{canManage ? <label className="status-control">Status
            <select aria-label="Project status" value={status} onChange={changeStatus}>
                {projectStatuses.map((label, index) => <option key={label} value={index}>{label}</option>)}
            </select></label> : <span>Status: {projectStatuses[status] || "Unknown"}</span>}</div>
        {error && <p className="panel-error" role="alert">{error}</p>}
        {editing && <form className="dashboard-form" onSubmit={save}>
            <label>Project name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={255} /></label>
            <button type="submit" disabled={saving || !name.trim()}>{saving ? "Saving..." : "Save project"}</button>
        </form>}
        <div className="detail-section"><h3>My tasks in this project</h3>
            {tasksLoading && <p>Loading tasks...</p>}
            {tasksError && <p className="panel-error" role="alert">{tasksError}</p>}
            {!tasksLoading && !tasksError && tasks.length === 0 && <p>No tasks in this project are assigned to you.</p>}
            {!tasksLoading && !tasksError && tasks.length > 0 && <ul className="project-task-list">{tasks.map((task) =>
                <li key={task.task_id}><span>{task.task_heading}</span><span className="card-overline">Task #{task.task_id}</span></li>)}</ul>}
        </div>
    </div>;
};
