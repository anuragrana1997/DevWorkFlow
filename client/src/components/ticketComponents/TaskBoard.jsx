import { useState } from "react";
import { TicketStat } from "./TicketStat";
import { TicketDetails } from "./TicketDetails";

export const TaskBoard = ({ tasks, projects, loading, error, onCreate, onUpdate }) => {
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [creating, setCreating] = useState(false);
    const [heading, setHeading] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [priority, setPriority] = useState(0);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const selectedTask = tasks.find((task) => task.task_id === selectedTaskId);

    const submit = async (event) => {
        event.preventDefault();
        if (!heading.trim()) return;
        setSaving(true);
        setFormError("");
        try {
            const task = await onCreate({ task_heading: heading.trim(), task_description: description.trim(), task_priority: priority,
                ...(projectId ? { project_id: Number(projectId) } : {}) });
            setSelectedTaskId(task.task_id);
            setHeading("");
            setDescription("");
            setProjectId("");
            setPriority(0);
            setCreating(false);
        } catch (error) {
            setFormError(error.response?.data?.message || "Unable to create task.");
        } finally {
            setSaving(false);
        }
    };

    return <div className="dashboard-panels">
        <aside className="dashboard-sidebar" aria-label="Your tasks">
            <div className="panel-heading"><h2>My tasks</h2><span className="panel-actions">
                {!loading && !error && <span className="panel-count">{tasks.length}</span>}
                <button type="button" className="action-button" onClick={() => setCreating(!creating)}>{creating ? "Cancel" : "+ Create task"}</button>
            </span></div>
            {creating && <form className="dashboard-form sidebar-form" onSubmit={submit}>
                <label>Task title<input value={heading} onChange={(event) => setHeading(event.target.value)} required maxLength={255} /></label>
                <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
                <label>Project<select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                    <option value="">No project</option>
                    {projects.map((project) => <option key={project.project_id} value={project.project_id}>{project.project_name}</option>)}
                </select></label>
                <label>Priority<select value={priority} onChange={(event) => setPriority(Number(event.target.value))}>
                    <option value={0}>Low</option><option value={1}>Medium</option><option value={2}>High</option>
                </select></label>
                {formError && <p className="panel-error" role="alert">{formError}</p>}
                <button type="submit" disabled={saving}>{saving ? "Creating..." : "Create task"}</button>
            </form>}
            {loading && <p className="panel-message">Loading tasks...</p>}
            {error && <p className="panel-message panel-error" role="alert">{error}</p>}
            {!loading && !error && tasks.length === 0 && <p className="panel-message">No tasks are assigned to you yet.</p>}
            <div className="dashboard-card-list">{tasks.map((task) => <button key={task.task_id} type="button"
                className={`dashboard-card ${selectedTaskId === task.task_id ? "selected" : ""}`}
                aria-pressed={selectedTaskId === task.task_id} onClick={() => setSelectedTaskId(task.task_id)}>
                <TicketStat ticket={task} /></button>)}</div>
        </aside>
        <section className="dashboard-detail" aria-label="Task details">
            {selectedTask ? <TicketDetails key={selectedTask.task_id} ticket={selectedTask} projects={projects} onUpdate={onUpdate} /> :
                <div className="detail-placeholder"><h2>Task details</h2><p>Select a task to view its details and comments.</p></div>}
        </section>
    </div>;
};
