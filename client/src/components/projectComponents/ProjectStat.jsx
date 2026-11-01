const statuses = ["Pending", "Active", "Completed"];

export const ProjectStat = ({ project }) => (
    <span className="project-card-content">
        <span className="card-overline">Project #{project.project_id}</span>
        <span className="card-title">{project.project_name}</span>
        <span className="card-caption">{statuses[project.project_status] || "Unknown"}</span>
    </span>
);
