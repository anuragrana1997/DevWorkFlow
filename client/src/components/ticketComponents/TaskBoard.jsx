import { useState } from "react";
import { TicketStat } from "./TicketStat";
import { TicketDetails } from "./TicketDetails";

export const TaskBoard = ({ tasks, loading, error }) => {
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const selectedTask = tasks.find((task) => task.task_id === selectedTaskId);

    return (
        <div className="dashboard-panels">
            <aside className="dashboard-sidebar" aria-label="Your tasks">
                <div className="panel-heading">
                    <h2>My tasks</h2>
                    {!loading && !error && <span className="panel-count">{tasks.length}</span>}
                </div>
                {loading && <p className="panel-message">Loading tasks...</p>}
                {error && <p className="panel-message panel-error" role="alert">{error}</p>}
                {!loading && !error && tasks.length === 0 && (
                    <p className="panel-message">No tasks are assigned to you yet.</p>
                )}
                <div className="dashboard-card-list">
                    {tasks.map((task) => (
                        <button key={task.task_id} type="button"
                            className={`dashboard-card ${selectedTaskId === task.task_id ? "selected" : ""}`}
                            aria-pressed={selectedTaskId === task.task_id}
                            onClick={() => setSelectedTaskId(task.task_id)}>
                            <TicketStat ticket={task} />
                        </button>
                    ))}
                </div>
            </aside>
            <section className="dashboard-detail" aria-label="Task details">
                {selectedTask ? (
                    <TicketDetails ticket={selectedTask} />
                ) : (
                    <div className="detail-placeholder">
                        <h2>Task details</h2>
                        <p>Select a task to view its details and comments.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
