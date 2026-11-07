import { useEffect, useState } from "react";
import { api } from "../../config/api";

export const TaskHistory = ({ taskId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        api.get(`/api/task/${taskId}/history`, { signal: controller.signal }).then((response) => {
            setLogs(response.data.logs || []);
        }).catch((requestError) => {
            if (requestError.code !== "ERR_CANCELED") setError(requestError.response?.data?.message || "Unable to load activity history.");
        }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [taskId]);

    return <section className="detail-section task-history">
        <h3>Activity history</h3>
        {loading && <p>Loading activity...</p>}
        {error && <p className="panel-error" role="alert">{error}</p>}
        {!loading && !error && logs.length === 0 && <p>No activity recorded for this task.</p>}
        {!loading && !error && logs.length > 0 && <ol>{logs.map((log) => <li key={log.log_id}>
            <div><strong>{log.author_name}</strong><time dateTime={log.created_at}>{new Date(log.created_at).toLocaleString()}</time></div>
            <p>{log.log_description || "Activity recorded"}</p>
            {Number(log.hours_logged) > 0 && <small>{log.hours_logged} hours logged</small>}
        </li>)}</ol>}
    </section>;
};
