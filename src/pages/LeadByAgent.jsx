import { useState, useEffect } from "react";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
import axios from "axios";
import Nav from "../components/Nav";

export default function LeadByAgent() {
  const [leads, setLeads] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [leadsRes, agentsRes] = await Promise.all([
        axios.get("https://crm-app-backend-jade.vercel.app/leads"),
        axios.get("https://crm-app-backend-jade.vercel.app/agents"),
      ]);
      setLeads(leadsRes.data);
      setSalesAgents(agentsRes.data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Choose leads for the selected agent and filter/sort
  const getFilteredLeads = () => {
    let filtered = leads.filter(
      lead => selectedAgent === "" || (lead.salesAgent?._id || lead.salesAgent) === selectedAgent
    );
    if (statusFilter !== "all") filtered = filtered.filter(l => l.status === statusFilter);
    if (priorityFilter !== "all") filtered = filtered.filter(l => l.priority === priorityFilter);

    if (sortBy === "timeToClose") {
      filtered = filtered.sort((a, b) => (a.timeToClose || 0) - (b.timeToClose || 0));
    }
    return filtered;
  };

  const selectedAgentObj = salesAgents.find(a => a._id === selectedAgent);

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

  return (
    <div>
      <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
        <h1 className="text-center">Leads by Sales Agent</h1>
      </nav>

      <div className="row">
        <div className="col-2 p-0 sidebar-green">
          <BackToDashboardSideBar />
        </div>
        <div className="col-8 py-4">
          <div className="mb-3 fs-4">
            <strong>Sales Agent:</strong>
            <select
              className="ms-2"
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
            >
              <option value="">Select Agent</option>
              {salesAgents.map(agent => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          {/* List leads */}
          <div>
            {selectedAgent && (
              <div className="mb-3">
                <strong>
                  Sales Agent:{" "}
                  {selectedAgentObj ? selectedAgentObj.name : "Unknown"}
                </strong>
              </div>
            )}
            <div className="fs-4">
              {getFilteredLeads().length === 0
                ? <div className="text-muted py-3">No leads to display</div>
                : getFilteredLeads().map((lead, idx) => (
                    <div key={lead._id || idx} className="border-bottom py-2">
                      <div>
                        <strong>{lead.name || `Lead ${idx + 1}`}</strong>{" "}
                        [Status: {lead.status}]
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="d-flex gap-3 mt-4">
           <div className="row">
              {/* Filter by Sales Agent */}
              <h3>Filters : </h3>
              <div className="col-auto">
              <label className="me-1 form-label fs-4">Status:</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="form-control fs-4"
              >
                <option value="all">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Contracted">Contracted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
           
            <div className="col-auto">
              <label className="me-1 form-label fs-4">Priority:</label>
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="form-control fs-4"
              >
                <option value="all">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
           </div>
            </div>
           <div className="row mt-3">
            <h3>Sort By: </h3>
            <div className="col-auto">
              <label className="me-1 form-label">Time to Close</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-control fs-4">
                <option value="">None</option>
                <option value="timeToClose">High to Low</option>
              </select>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
