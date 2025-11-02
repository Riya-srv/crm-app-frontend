import { Link } from "react-router-dom"

export default function SideBar(){
    return(
        <>
        <div className="container bg-success min-vh-100" style={{ minWidth: "180px" }}>
      <nav className="nav flex-column p-4">
        <Link className="nav-link text-dark fs-4" to="/leads">Leads</Link>
        <Link className="nav-link text-dark fs-4" to="/addNewLead">Add New Lead</Link>
        <Link className="nav-link text-dark fs-4" to="/agents">Agents</Link>
        <Link className="nav-link text-dark fs-4" to="/addNewAgent">Add New Agent</Link>
        <Link className="nav-link text-dark fs-4" to="/leadStatusView">Lead Status View</Link>
        <Link className="nav-link text-dark fs-4" to="/leadAgentView">Lead Agent View</Link>
        <Link className="nav-link text-dark fs-4" to="/reports">Reports</Link>
        <Link className="nav-link text-dark fs-4" to="/settings">Settings</Link>
        
      </nav>
        </div>
        </>
    )
}