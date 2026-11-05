
import { useState, useEffect } from "react";
import { api } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export const Comments = ({ ticketId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [busyId, setBusyId] = useState(null);

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

    const updateComment = async (commentId) => {
        if (!editText.trim()) return;
        setBusyId(commentId);
        setError("");
        try {
            await api.patch("/api/comment/updateComment", { comment_id: commentId, comment_description: editText.trim() });
            setComments((previous) => previous.map((comment) => comment.comment_id === commentId
                ? { ...comment, comment_description: editText.trim() } : comment));
            setEditingId(null);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update comment.");
        } finally {
            setBusyId(null);
        }
    };

    const deleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        setBusyId(commentId);
        setError("");
        try {
            await api.delete("/api/comment/deleteComment", { data: { comment_id: commentId } });
            setComments((previous) => previous.filter((comment) => comment.comment_id !== commentId));
        } catch (error) {
            setError(error.response?.data?.message || "Unable to delete comment.");
        } finally {
            setBusyId(null);
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
                        {editingId === comment.comment_id ? <div className="comment-edit">
                            <textarea aria-label="Edit comment" value={editText} onChange={(event) => setEditText(event.target.value)} />
                            <div><button type="button" disabled={busyId === comment.comment_id || !editText.trim()}
                                onClick={() => updateComment(comment.comment_id)}>Save</button>
                                <button type="button" className="text-button" onClick={() => setEditingId(null)}>Cancel</button></div>
                        </div> : <span>{comment.comment_description}</span>}
                        {user?.user_id === comment.user_id && editingId !== comment.comment_id && <span className="comment-actions">
                            <button type="button" title="Edit comment" aria-label="Edit comment" disabled={busyId === comment.comment_id}
                                onClick={() => { setEditingId(comment.comment_id); setEditText(comment.comment_description); }}>✎</button>
                            <button type="button" title="Delete comment" aria-label="Delete comment" disabled={busyId === comment.comment_id}
                                onClick={() => deleteComment(comment.comment_id)}>×</button>
                        </span>}
                    </div>
                ))}
            </div>
        </div>
    );
};
