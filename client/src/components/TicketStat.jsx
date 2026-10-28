export const TicketStat = ({ ticketId, ticketName, ticketPriority }) => {

    return (
        <div className="ticket-stat-container">
            <h6>{ticketId}</h6>
            <div className="ticket-stat-subcontainer">
                <p>{ticketName}</p>
                <p>{ticketPriority}</p>
            </div>
        </div>
    )
}