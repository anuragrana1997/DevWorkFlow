import { useState } from "react";
import { ProjectStat } from "./ProjectStat";
import { ProjectDetails } from "./ProjectDetails";

export const ProjectBoard = ({ projects, tasks, loading, error, tasksLoading, tasksError }) => {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const selectedProject = projects.find((project) => project.project_id === selectedProjectId);

    return (
        <div className="dashboard-panels">
            <aside className="dashboard-sidebar" aria-label="Your projects">
                <div className="panel-heading">
                    <h2>My projects</h2>
                    {!loading && !error && <span className="panel-count">{projects.length}</span>}
                </div>
                {loading && <p className="panel-message">Loading projects...</p>}
                {error && <p className="panel-message panel-error" role="alert">{error}</p>}
                {!loading && !error && projects.length === 0 && (
                    <p className="panel-message">You have no projects yet.</p>
                )}
                <div className="dashboard-card-list">
                    {projects.map((project) => (
                        <button key={project.project_id} type="button"
                            className={`dashboard-card ${selectedProjectId === project.project_id ? "selected" : ""}`}
                            aria-pressed={selectedProjectId === project.project_id}
                            onClick={() => setSelectedProjectId(project.project_id)}>
                            <ProjectStat project={project} />
                        </button>
                    ))}
                </div>
            </aside>
            <section className="dashboard-detail" aria-label="Project details">
                {selectedProject ? (
                    <ProjectDetails project={selectedProject}
                        tasks={tasks.filter((task) => task.project_id === selectedProject.project_id)}
                        tasksLoading={tasksLoading} tasksError={tasksError} />
                ) : (
                    <div className="detail-placeholder">
                        <h2>Project details</h2>
                        <p>Select a project to view its details and your assigned tasks.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
