import AgentForm from "../components/AgentForm";
import { NavLink } from "react-router-dom";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
export default function AddNewAgent(){
    return(
        <>
       <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
      <NavLink className="navbar-brand" to="/">
        <h1 className="text-center">Add New Sales Agent</h1>
      </NavLink>
      </nav>
      <div className="row">
        <div className="col-2 p-0 sidebar-green">
          <BackToDashboardSideBar/>
        </div>
        <div className="col-6 main-layout container py-3">
          <AgentForm />
        </div>
      </div>
        </>
    )
}