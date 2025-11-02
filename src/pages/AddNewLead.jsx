import LeadForm from "../components/LeadForm";
import { NavLink } from "react-router-dom";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";

export default function AddNewLead(){
    return(
        <>
       <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
      <NavLink className="navbar-brand" to="/">
        <h1 className="text-center">Add New Lead</h1>
      </NavLink>
      </nav>
      <div className="row">
        <div className="col-2 p-0 sidebar-green">
          <BackToDashboardSideBar/>
        </div>
        <div className="col-6 main-layout container py-3">
          <LeadForm />
        </div>
      </div>
      
        </>
    )
}