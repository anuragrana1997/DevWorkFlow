import { projectStatuses } from "../../config/statuses";

export const ProjectStat = ({ project }) => (
    <span className="project-card-content">
        <span className="card-overline">Project #{project.project_id}</span>
        <span className="card-title">{project.project_name}</span>
        <span className="card-caption">{projectStatuses[project.project_status] || "Unknown"}</span>
    </span>
);
