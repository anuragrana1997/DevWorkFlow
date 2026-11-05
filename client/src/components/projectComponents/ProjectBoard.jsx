import { useState } from "react";
import { ProjectStat } from "./ProjectStat";
import { ProjectDetails } from "./ProjectDetails";

export const ProjectBoard = ({ projects, tasks, loading, error, tasksLoading, tasksError, canManage, onCreate, onUpdate }) => {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const selectedProject = projects.find((project) => project.project_id === selectedProjectId);

    const submit = async (event) => {
        event.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        setFormError("");
        try {
            const project = await onCreate({ project_name: name.trim() });
            setSelectedProjectId(project.project_id);
            setName("");
            setCreating(false);
        } catch (error) {
            setFormError(error.response?.data?.message || "Unable to create project.");
        } finally {
            setSaving(false);
        }
    };

    return <div className="dashboard-panels">
        <aside className="dashboard-sidebar" aria-label="Your projects">
            <div className="panel-heading"><h2>My projects</h2><span className="panel-actions">
                {!loading && !error && <span className="panel-count">{projects.length}</span>}
                {canManage && <button type="button" className="action-button" onClick={() => setCreating(!creating)}>
                    {creating ? "Cancel" : "+ Create project"}</button>}
            </span></div>
            {creating && <form className="dashboard-form sidebar-form" onSubmit={submit}>
                <label>Project name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={255} /></label>
                {formError && <p className="panel-error" role="alert">{formError}</p>}
                <button type="submit" disabled={saving}>{saving ? "Creating..." : "Create project"}</button>
            </form>}
            {loading && <p className="panel-message">Loading projects...</p>}
            {error && <p className="panel-message panel-error" role="alert">{error}</p>}
            {!loading && !error && projects.length === 0 && <p className="panel-message">You have no projects yet.</p>}
            <div className="dashboard-card-list">{projects.map((project) => <button key={project.project_id} type="button"
                className={`dashboard-card ${selectedProjectId === project.project_id ? "selected" : ""}`}
                aria-pressed={selectedProjectId === project.project_id} onClick={() => setSelectedProjectId(project.project_id)}>
                <ProjectStat project={project} /></button>)}</div>
        </aside>
        <section className="dashboard-detail" aria-label="Project details">
            {selectedProject ? <ProjectDetails key={selectedProject.project_id} project={selectedProject} canManage={canManage} onUpdate={onUpdate}
                tasks={tasks.filter((task) => task.project_id === selectedProject.project_id)}
                tasksLoading={tasksLoading} tasksError={tasksError} /> :
                <div className="detail-placeholder"><h2>Project details</h2><p>Select a project to view its details and your assigned tasks.</p></div>}
        </section>
    </div>;
};
