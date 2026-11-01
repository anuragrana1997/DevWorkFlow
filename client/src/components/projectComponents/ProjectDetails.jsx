const statuses = ["Pending", "Active", "Completed"];

export const ProjectDetails = ({ project, tasks, tasksLoading, tasksError }) => (
    <div className="project-details">
        <p className="detail-overline">Project #{project.project_id}</p>
        <h2>{project.project_name}</h2>
        <div className="detail-meta">
            <span>Status: {statuses[project.project_status] || "Unknown"}</span>
        </div>
        <div className="detail-section">
            <h3>My tasks in this project</h3>
            {tasksLoading && <p>Loading tasks...</p>}
            {tasksError && <p className="panel-error" role="alert">{tasksError}</p>}
            {!tasksLoading && !tasksError && tasks.length === 0 && (
                <p>No tasks in this project are assigned to you.</p>
            )}
            {!tasksLoading && !tasksError && tasks.length > 0 && (
                <ul className="project-task-list">
                    {tasks.map((task) => (
                        <li key={task.task_id}>
                            <span>{task.task_heading}</span>
                            <span className="card-overline">Task #{task.task_id}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);
