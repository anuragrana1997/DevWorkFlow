export const TicketStat = ({ ticketId, ticketHeading, ticketPriority }) => {

    return (
        <div className="ticket-stat-container">
            <h6>{ticketId}</h6>
            <div className="ticket-stat-subcontainer">
                <p>{ticketHeading}</p>
                <p>{ticketPriority}</p>
            </div>
        </div>
    )
}