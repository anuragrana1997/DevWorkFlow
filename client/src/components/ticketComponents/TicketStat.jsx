const priorities = ["Low", "Medium", "High"];

export const TicketStat = ({ ticket }) => (
    <span className="ticket-card-content">
        <span className="card-overline">Task #{ticket.task_id}</span>
        <span className="card-title">{ticket.task_heading}</span>
        <span className="card-caption">
            Priority: {priorities[ticket.task_priority] || "Unspecified"}
        </span>
    </span>
);
