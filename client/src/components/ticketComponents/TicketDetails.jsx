import { Comments } from "../commentComponents/Comments";

const statuses = ["Pending", "In progress", "Completed"];
const priorities = ["Low", "Medium", "High"];

export const TicketDetails = ({ ticket }) => (
    <div className="ticket-details">
        <p className="detail-overline">Task #{ticket.task_id}</p>
        <h2>{ticket.task_heading}</h2>
        <div className="detail-meta">
            <span>Status: {statuses[ticket.task_status] || "Unknown"}</span>
            <span>Priority: {priorities[ticket.task_priority] || "Unspecified"}</span>
            {ticket.project_id && <span>Project #{ticket.project_id}</span>}
        </div>
        <div className="detail-section">
            <h3>Description</h3>
            <p>{ticket.task_description || "No description provided."}</p>
        </div>
        <Comments key={ticket.task_id} ticketId={ticket.task_id} />
    </div>
);
