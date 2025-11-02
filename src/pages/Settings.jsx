import { useState, useEffect } from "react";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";

export default function Settings() {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    fetchLeads();
  }, []);

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const res = await fetch("https://crm-app-backend-jade.vercel.app/agents");
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : []);

    } catch (err) {
      toast.error("Failed to fetch agents", { position: "bottom-right"});
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const res = await fetch("https://crm-app-backend-jade.vercel.app/leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch leads", { position: "bottom-right"});
    } finally {
      setLoading(false);
    }
  };

  // Delete agent
  const handleDeleteAgent = async (id) => {
    try {
      const res = await fetch(`https://crm-app-backend-jade.vercel.app/agents/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete agent");
      toast.success("Agent deleted!", { position: "bottom-right"});
      fetchAgents();
    } catch (err) {
      toast.error(`Error deleting agent: ${err.message}`, { position: "bottom-right"});
    }
  };

  // Delete lead
  const handleDeleteLead = async (id) => {
    try {
      const res = await fetch(`https://crm-app-backend-jade.vercel.app/leads/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete lead");
      toast.success("Lead deleted!", { position: "bottom-right"});
      fetchLeads();
    } catch (err) {
      toast.error(`Error deleting lead: ${err.message}`, { position: "bottom-right"});
    }
  };

      if (loading) {
        return (
          <div className="app-container">
            <Nav/>
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading Data...</p>
            </div>
          </div>
        );
      }

  return (
    <>
    <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
        <h1 className="text-center">Settings Page</h1>
    </nav>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">

          <div className="col-2 p-0 sidebar-green">
            <BackToDashboardSideBar />
          </div>
          <div className="col-8 py-4">
            <h2>Settings</h2>

            
            <div className="card p-3 mb-4">
              <h5 className="mb-3">Sales Agents</h5>
              {agents.length === 0 ? (
                <p>No sales agents found.</p>
              ) : (
                <ul className="list-group">
                  {agents.map((agent) => {
                    const agentId = agent._id || agent.id;
                    return (
                      <li key={agentId} className="list-group-item d-flex justify-content-between align-items-center">
                        {agent.name} ({agent.email})
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAgent(agentId)}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            
            <div className="card p-3 mb-4">
              <h5 className="mb-3">Leads</h5>
              {leads.length === 0 ? (
                <p>No leads found.</p>
              ) : (
                <ul className="list-group">
                  {leads.map((lead) => {
                    const leadId = lead._id || lead.id;
                    return (
                      <li key={leadId} className="list-group-item d-flex justify-content-between align-items-center">
                        {lead.name} - {lead.status}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteLead(leadId)}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
