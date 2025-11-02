import { NavLink } from "react-router-dom";

export default function Nav() {
    return(
        <>
        <nav className="navbar bg-success d-flex justify-content-center py-3">
            <NavLink className="navbar-brand" to="/"><h1 className="text-center">Anvaya CRM Dashboard</h1></NavLink>
        </nav>
        </>
    )
}