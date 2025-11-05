import { useState, useEffect } from "react";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
import axios from "axios";
import Nav from "../components/Nav";

export default function LeadStatusView() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("New"); 
  const [salesAgents, setSalesAgents] = useState([]);
  const [agentFilter, setAgentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [leadsRes, agentsRes] = await Promise.all([
        axios.get("https://crm-app-backend-jade.vercel.app/leads"),
        axios.get("https://crm-app-backend-jade.vercel.app/agents")
      ]);
      setLeads(leadsRes.data);
      setSalesAgents(agentsRes.data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Filter and Sort logic
  const getFilteredLeads = () => {
    let filtered = leads
      .filter(lead => lead.status === statusFilter)
      .filter(lead =>
        agentFilter === "all"
          ? true
          : (lead.salesAgent?._id || lead.salesAgent) === agentFilter
      )
      .filter(lead =>
        priorityFilter === "all" ? true : lead.priority === priorityFilter
      );

    if (sortBy === "timeToClose") {
      filtered = filtered.sort(
        (a, b) => (a.timeToClose || 0) - (b.timeToClose || 0)
      );
    }
    return filtered;
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

  return (
    <div>
      <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
        <h1 className="text-center">Leads by Status</h1>
      </nav>

      <div className="row">
        <div className="col-2 p-0 sidebar-green">
          <BackToDashboardSideBar />
        </div>
        <div className="col-8 py-4">
          <div className="fs-4 mb-3">
            <strong className="form-label">Status:</strong>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="ms-2 form-control fs-4"
            >
              {/* Add or fetch all statuses as needed */}
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Contracted">Contracted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            {getFilteredLeads().length === 0
              ? <div className="fs-4 py-3">No leads to display</div>
              : getFilteredLeads().map((lead, idx) => (
                  <div key={lead._id || idx} className="fs-4 border-bottom py-2">
                    <div>
                      <strong>
                        {lead.name || `Lead ${idx + 1}`}
                      </strong>
                      {lead.salesAgent?.name
                        ? <> [Sales Agent: {lead.salesAgent.name}]</>
                        : null}
                    </div>
                  </div>
                ))}
          </div>

          <div className="d-flex gap-3 mt-4 fs-4">
            <div className="row">
              {/* Filter by Sales Agent */}
              <h3>Filters : </h3>
              <div className="col-auto">
              <label className="me-1 form-label">Sales Agent:</label>
              <select
                value={agentFilter}
                onChange={e => setAgentFilter(e.target.value)}
                className="form-control fs-4"
              >
                <option value="all">All</option>
                {salesAgents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-auto">
              {/* Filter by Priority */}
              <label className="me-1 form-label">Priority:</label>
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
              {/* Sort by Time to Close */}
              <label className="me-1 form-label fs-4">Time to Close:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-control fs-4"
              >
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
