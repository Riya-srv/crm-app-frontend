import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
export default function Agents(){
    const [salesAgents, setSalesAgents] = useState([]);

   useEffect(() => {
    axios.get('https://crm-app-backend-jade.vercel.app/agents').then(res => setSalesAgents(res.data));
  }, []);

  const navigate = useNavigate();
    return(
        <>
            <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
              <NavLink className="navbar-brand" to="/">
                <h1 className="text-center">Sales Agent Management</h1>
              </NavLink>
              </nav>
              <div className="row">
                <div className="col-2 p-0 sidebar-green">
                <BackToDashboardSideBar />
                </div>
                <div className="col-6 container py-3">
                <h1 className="m-4 px-5">Sales Agent List</h1>
                <ul className="list-group m-4 px-5">{salesAgents.map(agent => (
                <li className="list-group-item fs-4 py-4" key={agent._id} value={agent._id}>Agent: {agent.name} - {agent.email}</li>
              ))}</ul>
              <button className="mx-5 fs-4 btn btn-success"  style={{ width: "90%" }}onClick={() => navigate("/addNewAgent")}>Add New Agent</button>
               </div>
              </div>
        </>
    )
}