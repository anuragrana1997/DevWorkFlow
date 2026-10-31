import { useEffect, useState } from "react"
import { api } from "../config/api";
import { TicketStat } from "../components/ticketComponents/TicketStat";
import { TicketDetails } from "../components/ticketComponents/TicketDetails";

export const Dashboard = () => {
    //call ticket details here if user wants to see tickets else projects

    // const [ isTicketPage, setTicketPage ] = useState(1);
    // const [ isProjectPage, setProjectPage ] = useState(0);
    // const [ projectData, setProjectData ] = useState([]);

    const [ ticketData, setTicketData] = useState([]);
    const [ selectedTicketId,  setSelectedTicketId ] = useState();

    const selectedTicket = ticketData.find(
        ticket => ticket.id == selectedTicketId
    )

    useEffect(() => {

        const fetchTicketData = async() => {
            try {
                const response = await api.get(`/api/task/getAllTasks`)
                if(response) {
                    setTicketData(response.task)
                }
            } catch (error) {
                console.log(error.message())
            }
        }

        fetchTicketData();
    }, [])

    return (
        <div className="dashboard-container">
            <div className="stat-card">
                {ticketData && ticketData.map(ticket => (
                    <div key={ticket.task_id} onClick={() => setSelectedTicketId(ticket.task_id)}>
                        <TicketStat 
                            ticketId={ticket.task_id} 
                            ticketHeading={ticket.ticket_heading} 
                            ticketPriority={ticket.ticket_priority} 
                        />
                    </div>
                ))}
            </div>
            <div className="stat-card-expanded">
                {
                    selectedTicket ? 
                    <TicketDetails 
                        ticketId={selectedTicket.task_id} 
                        ticketHeading={selectedTicket.task_heading}
                        ticketDescription={selectedTicket.task_description}
                    />
                    : 
                    <p>Select a ticket to view details</p>
                }
            </div>
        </div>
    )
}