import { useState } from "react";
import { Comments } from "../commentComponents/Comments";
import { taskStatuses } from "../../config/statuses";

const priorities = ["Low", "Medium", "High"];

export const TicketDetails = ({ ticket, projects, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [heading, setHeading] = useState(ticket.task_heading);
    const [description, setDescription] = useState(ticket.task_description || "");
    const [priority, setPriority] = useState(ticket.task_priority ?? 0);
    const [projectId, setProjectId] = useState(ticket.project_id ?? "");
    const [status, setStatus] = useState(ticket.task_status);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const save = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await onUpdate(ticket.task_id, { task_heading: heading.trim(), task_description: description.trim(),
                task_priority: priority, project_id: projectId === "" ? null : Number(projectId) });
            setEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update task.");
        } finally {
            setSaving(false);
        }
    };

    const changeStatus = async (event) => {
        const nextStatus = Number(event.target.value);
        setStatus(nextStatus);
        setError("");
        try {
            await onUpdate(ticket.task_id, { task_status: nextStatus });
        } catch (error) {
            setStatus(ticket.task_status);
            setError(error.response?.data?.message || "Unable to update status.");
        }
    };

    return <div className="ticket-details">
        <div className="detail-heading"><p className="detail-overline">Task #{ticket.task_id}</p>
            <button type="button" className="text-button" onClick={() => {
                if (editing) { setHeading(ticket.task_heading); setDescription(ticket.task_description || "");
                    setPriority(ticket.task_priority ?? 0); setProjectId(ticket.project_id ?? ""); }
                setEditing(!editing);
            }}>{editing ? "Cancel" : "Edit task"}</button></div>
        <h2>{ticket.task_heading}</h2>
        <div className="detail-meta">
            <label className="status-control">Status <select aria-label="Task status" value={status} onChange={changeStatus}>
                {taskStatuses.map((label, index) => <option key={label} value={index}>{label}</option>)}
            </select></label>
            <span>Priority: {priorities[ticket.task_priority] || "Unspecified"}</span>
            {ticket.project_id && <span>Project #{ticket.project_id}</span>}
        </div>
        {error && <p className="panel-error" role="alert">{error}</p>}
        {editing ? <form className="dashboard-form" onSubmit={save}>
            <label>Task title<input value={heading} onChange={(event) => setHeading(event.target.value)} required maxLength={255} /></label>
            <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
            <label>Project<select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                <option value="">No project</option>
                {projects.map((project) => <option key={project.project_id} value={project.project_id}>{project.project_name}</option>)}
            </select></label>
            <label>Priority<select value={priority} onChange={(event) => setPriority(Number(event.target.value))}>
                <option value={0}>Low</option><option value={1}>Medium</option><option value={2}>High</option>
            </select></label>
            <button type="submit" disabled={saving || !heading.trim()}>{saving ? "Saving..." : "Save task"}</button>
        </form> : <div className="detail-section"><h3>Description</h3><p>{ticket.task_description || "No description provided."}</p></div>}
        <Comments key={ticket.task_id} ticketId={ticket.task_id} />
    </div>;
};
