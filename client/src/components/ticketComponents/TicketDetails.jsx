import { Comments } from "../commentComponents/Comments"

export const TicketDetails = ({ ticketId }) => {

    return (
        <div className="ticket-details-container">
            <h5>{ticketHeading}</h5>
            <p>{ticketDescription}</p>
            <Comments ticketId={ticketId} />
        </div>
    )
}