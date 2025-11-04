import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
import { NavLink } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from '../components/Nav'


export default function Leads(){
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [salesAgents, setSalesAgents] = useState([]);

  const [agentFilter, setAgentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };


  useEffect(() => {fetchLeads()},[])

  const navigate = useNavigate();
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://crm-app-backend-jade.vercel.app/leads");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle different response structures
      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else if (data && data.data && Array.isArray(data.data)) {
        setLeads(data.data);
      } else {
        // If it's an object but not an array, convert it to an array
        setLeads([data]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLeads = () => {
    if (!Array.isArray(leads)) return [];

    return leads
      .filter((lead) =>
        statusFilter === "all" ? true : lead.status === statusFilter
      )
      .filter((lead) => agentFilter === "all" ? true : ( typeof lead.salesAgent=="string" ? lead.salesAgent === agentFilter : lead.salesAgent?._id === agentFilter))
      .sort((a, b) => {
        if (sortBy === "Priority") {
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        return 0;
      })
      .sort((a, b) => {
        if (sortBy === "timeToClose") {
          return (a.timeToClose || 0) - (b.timeToClose || 0);
        }
        return 0;
      });
  };

  const filteredLeads = getFilteredLeads();

useEffect(() => {
  fetchAgents();
}, []);

const fetchAgents = async () => {
  try {
    const response = await fetch("https://crm-app-backend-jade.vercel.app/agents");
    if (!response.ok) throw new Error("Failed to fetch agents");
    const data = await response.json();

    setSalesAgents(Array.isArray(data) ? data : data.agents || []);
  } catch (err) {

    setSalesAgents([]);
  }
};

  if (loading) {
      return (
        <div className="app-container">
          <Nav />
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading Data...</p>
          </div>
        </div>
      );
    }
  
      if (error) {
      return (
        <div className="app-container">
          <Nav />
          <div className="error-container">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button className="btn btn-primary" onClick={fetchLeads}>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return(
    <>
       <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
      <NavLink className="navbar-brand" to="/">
        <h1 className="text-center">Lead List</h1>
      </NavLink>
      </nav>
      
          <div className="row">
            <div className="col-2 p-0 sidebar-green">
              <BackToDashboardSideBar />
            </div>
      <div className="col main-layout container py-3">
        <h1 className="my-3">Lead Overview</h1>
        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          {/* Status Filter */}
          <label htmlFor="statusFilter">Filter by Lead Status: </label>
          <select
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Leads</option>
            <option value="New">New</option>
            <option value="Contracted">Contracted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Agent Filter */}
          <label htmlFor="statusFilter">Filter by Sales Agent: </label>
          <select
            className="form-select w-auto"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          >
              <option value="all">All Agents</option>
                {salesAgents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                    {agent.name}
                    </option>
                ))}
          </select>


          {/* Sort Filter */}
          <label htmlFor="sortBy">Sort By: </label>
          <select
            className="form-select w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">None</option>
            <option value="Priority">Priority</option>
            <option value="timeToClose">Time to Close</option>
          </select>

          {/* Add Lead Button */}
          <button className="btn btn-success" onClick={() => navigate("/addNewLead")}>
            Add New Lead
          </button>
        </div>

        {/* Leads List */}
        <div className="leads-list">
          {!filteredLeads.length ? (
            <div className="text-center text-muted py-5">
              <p>No leads found.</p>
            </div>
          ) : (
            filteredLeads.map((lead, index) => (
              <div
                key={lead._id || lead.id || index}
                className="lead-item border rounded p-3 mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/leads/${lead._id || lead.id}`)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{lead.name || `Lead ${index + 1}`}</h5>
                    <small className="text-muted">
                      {lead.status || "No Status"} |{" "}
                      {lead.priority || "No Priority"}

                    </small>
                  </div>
                  <div>
                    <span className="badge btn-add text-white fw-bolder">
                      {lead.source || "Unknown Source"}
                    </span>
                  </div>
                </div>

                {lead.email && <p className="mb-0 mt-2">{lead.email}</p>}
                {lead.phone && <p className="mb-0">{lead.phone}</p>}
                {lead.company && <p className="mb-0">{lead.company}</p>}
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </>
    )
}