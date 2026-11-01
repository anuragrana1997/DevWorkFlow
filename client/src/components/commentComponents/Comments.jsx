
import { useState, useEffect } from "react";
import { api } from "../../config/api";

export const Comments = ({ ticketId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            setSaving(true);
            setError("");
            const response = await api.post(
                "/api/comment/createComment",
                {
                    task_id: ticketId,
                    comment_description: newComment
                }
            );

            if (response.data.comment) {
                setComments((previous) => [...previous, response.data.comment]);
                setNewComment("");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Unable to add comment.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/api/comment/getComments/${ticketId}`,
                    { signal: controller.signal }
                );
                setComments(response.data.comments || []);
            } catch (error) {
                if (error.code !== "ERR_CANCELED") {
                    setError(error.response?.data?.message || "Unable to load comments.");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchComments();
        return () => controller.abort();
    }, [ticketId]);

    return (
        <div className="comment-container">
            <h3>Comments</h3>
            <div className="create-comment">
                <textarea
                    name="newComment"
                    id="newComment"
                    placeholder="Enter Comment!"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <button type="button" onClick={addComment} disabled={saving || loading}>
                    {saving ? "Adding..." : "Add comment"}
                </button>
            </div>
            {error && <p className="panel-error" role="alert">{error}</p>}
            {loading && <p>Loading comments...</p>}
            {!loading && !error && comments.length === 0 && <p>No comments yet.</p>}
            <div className="ticket-comments">
                {comments.map(comment => (
                    <div className="ticket-comment" key={comment.comment_id}>
                        {comment.comment_description}
                    </div>
                ))}
            </div>
        </div>
    );
};
