import { Link } from "react-router-dom"

export default function BackToDashboardSideBar(){
    return(
        <>
    <div className="container bg-success min-vh-100" style={{ minWidth: "180px" }}>
      <nav className="nav flex-column p-4">
        <Link className="nav-link text-dark fs-4" to="/">Back To Dashboard</Link>
      </nav>
        </div>
        </>
    )
}