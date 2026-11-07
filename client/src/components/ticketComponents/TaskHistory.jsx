import { useEffect, useState } from "react";
import { api } from "../../config/api";

const ActivityEntry = ({ log }) => (
    <li>
        <div className="task-history-meta">
            <strong>{log.author_name}</strong>
            <time dateTime={log.created_at}>
                {new Date(log.created_at).toLocaleString()}
            </time>
        </div>
        <p>{log.log_description}</p>
        {Number(log.hours_logged) > 0 && <small>{log.hours_logged} hours logged</small>}
    </li>
);

export const TaskHistory = ({ taskId, refreshVersion = 0 }) => {
    const [logs, setLogs] = useState([]);
    const [description, setDescription] = useState("");
    const [hours, setHours] = useState("0");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        api.get(`/api/task/${taskId}/history`, { signal: controller.signal })
            .then((response) => setLogs(response.data.logs || []))
            .catch((requestError) => {
                if (requestError.code !== "ERR_CANCELED") {
                    setError(requestError.response?.data?.message || "Unable to load activity history.");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [taskId, refreshVersion]);

    const addActivity = async (event) => {
        event.preventDefault();
        if (!description.trim()) return;

        setSaving(true);
        setError("");

        try {
            const response = await api.post(`/api/task/${taskId}/activity`, {
                log_description: description.trim(),
                hours_logged: Number(hours)
            });
            setLogs((previous) => [response.data.log, ...previous]);
            setDescription("");
            setHours("0");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to add activity.");
        } finally {
            setSaving(false);
        }
    };

    return <section className="detail-section task-history">
        <h3>Activity history</h3>
        <form className="dashboard-form task-activity-form" onSubmit={addActivity}>
            <label>What did you do?
                <textarea value={description} onChange={(event) => setDescription(event.target.value)}
                    required maxLength={2000} placeholder="Describe the work or update" />
            </label>
            <label>Hours logged
                <input type="number" min="0" max="9999" step="1" required
                    value={hours} onChange={(event) => setHours(event.target.value)} />
            </label>
            <button type="submit" disabled={saving || loading || !description.trim()}>
                {saving ? "Adding..." : "Add activity"}
            </button>
        </form>
        {loading && <p>Loading activity...</p>}
        {error && <p className="panel-error" role="alert">{error}</p>}
        {!loading && !error && logs.length === 0 && <p>No activity recorded for this task.</p>}
        {logs.length > 0 && <ol>{logs.map((log) => <ActivityEntry key={log.log_id} log={log} />)}</ol>}
    </section>;
};
