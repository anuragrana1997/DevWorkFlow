import { useEffect, useState } from "react"
import { api } from "../config/api"

export const TicketDetails = ({ ticketId, ticketHeading, ticketDescription }) => {

    const [comments, setComments] = useState([]);

    // need ticket edit
    // need comment edit
    const addComment = async() => {
        
    }

    useEffect(() => {
        const fetchComments = async() => {
            const response = await api.get(`/api/comment/getComments/${ticketId}`)
            console.log(response)
            if(response.data) {
                setComments(response)
            }
        }

        fetchComments()
    }, [ticketId])

    return (
        <div className="ticket-details-container">
            <h5>{ticketHeading}</h5>
            <p>{ticketDescription}</p>
            // make comment component separate
            <div className="ticket-details-comment-container">
                <div className="ticket-create-comment">
                    <textarea name="newComment" id="newComment" placeholder="Enter Comment!"></textarea>
                    <button onClick={addComment}>Add comment</button>
                </div>
                <div className="ticket-comments">
                    // need edit option here
                    {comments && array.forEach(comment => {
                        <div id={comment.id}>{comment.data}</div>
                    })}
                </div>
            </div>
        </div>
    )
}