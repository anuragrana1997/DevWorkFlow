
import { useState, useEffect } from "react";
import { api } from "../../config/api";

export const Comments = ({ ticketId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await api.post(
                "/api/comment/createComment",
                {
                    task_id: ticketId,
                    comment_description: newComment
                }
            );

            if (response.data.comment) {
                setComments(prev => [
                    ...prev,
                    response.data.comment
                ]);

                setNewComment("");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/api/comment/getComments/${ticketId}`
                );

                // Assumes backend returns { comments: [...] }
                setComments(response.data.comments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [ticketId]);

    return (
        <div className="comment-container">
            <div className="create-comment">
                <textarea
                    name="newComment"
                    id="newComment"
                    placeholder="Enter Comment!"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <button onClick={addComment}>
                    Add comment
                </button>
            </div>

            <div className="ticket-comments">
                {comments.map(comment => (
                    <div key={comment.id}>
                        {comment.comment_description}
                    </div>
                ))}
            </div>
        </div>
    );
};
