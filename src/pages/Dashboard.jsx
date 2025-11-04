import '../App.css'
import { useState, useEffect } from "react";
import SideBar from "../components/SideBar"
import Nav from "../components/Nav"
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

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

      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else if (data && data.data && Array.isArray(data.data)) {
        setLeads(data.data);
      } else {
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


  const getLeadsCount = (status) => {
    if (!Array.isArray(leads)) return 0;
    return leads.filter((lead) => lead && lead.status === status).length;
  };

  const newLeadsCount = getLeadsCount("New");
  const contractedLeadsCount = getLeadsCount("Contracted");
  const qualifiedLeadsCount = getLeadsCount("Qualified");

  const getFilteredLeads = () => {
    if (!Array.isArray(leads)) return [];

    if (filter === "all") {
      return leads;
    }

    return leads.filter((lead) => lead && lead.status === filter);
  };

  const filteredLeads = getFilteredLeads();

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

    return (
  <div className="container-fluid p-0">
    <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">

      <NavLink className="navbar-brand" to="/">
        <h1 className="text-center">Anvaya CRM Dashboard</h1>
      </NavLink>
    </nav>
    <div className="row">
      <div className="col-2 p-0 sidebar-green">
        <SideBar />
      </div>
      <div className="col">
        <div className="main-layout">
          <div className="content">

            <div className="leads-list row container">
              {
                !Array.isArray(leads) || filteredLeads.length === 0 ? (
                  <div className="no-leads col-12 m-3 p-3 fs-3 ">
                    {!Array.isArray(leads)
                      ? "Invalid data format received"
                      : "No leads found"}
                  </div>
                ) : (
                  filteredLeads.slice(0, 3).map((lead, index) => (
                    <div className="col-md-4 mb-3" key={lead.id || lead._id || index}>
                      <div className="card h-100 lead-item mt-4 p-3 m-2">
                        <div className="card-body">
                          <div className="lead-name h4 fs-2">
                            {lead.name || lead.fullName || `Lead ${index + 1}`}
                          </div>
                          <div className="lead-status fs-3">
                            {lead.status || "No Status"}
                          </div>
                          {lead.email && (
                            <div className="lead-email">{lead.email}</div>
                          )}
                          {lead.phone && (
                            <div className="lead-phone">{lead.phone}</div>
                          )}
                          {lead.company && (
                            <div className="lead-company">{lead.company}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )
              }
            </div>
<div className="container my-3 mx-0 py-3">
              <h3 className="mt-4">Lead Statuses : </h3>
            <div className="newLead">
              <div className="label  fw-3 fs-3">New <b className="count">[{newLeadsCount}]</b> Leads</div>
            </div>
            <div className="contractedLead">
              <div className="label  fw-3 fs-3">Contracted <b className="count">[{contractedLeadsCount}]</b> Leads</div>
            </div>
            <div className="qualifiedLead">
              <div className="label  fw-3 fs-3">Qualified <b className="count">[{qualifiedLeadsCount}]</b> Leads</div>
            </div>
          </div>
</div>

<div className="quick-filters-section container my-3 mx-0 py-3">
  <h3 className="mt-4">Quick Filters :</h3>
  <div className="quick-filters-buttons">
    <button
      className={`filter-btn btn btn-outline-success mx-3 px-3 ${filter === "New" ? "active" : ""}`}
      onClick={() => setFilter("New")}
    >
      New
    </button>
    <button
      className={`filter-btn btn btn-outline-success mx-3 px-3 ${filter === "Contracted" ? "active" : ""}`}
      onClick={() => setFilter("Contracted")}
    >
      Contracted
    </button>
    <button
      className={`filter-btn btn btn-outline-success mx-3 px-3 ${filter === "Qualified" ? "active" : ""}`}
      onClick={() => setFilter("Qualified")}
    >
      Qualified
    </button>
        <button
      className={`filter-btn btn btn-outline-success mx-3 px-3 ${filter === "Proposal Sent" ? "active" : ""}`}
      onClick={() => setFilter("Proposal Sent")}
    >
      Proposal Sent
    </button>
        <button
      className={`filter-btn btn btn-outline-success mx-3 px-3 ${filter === "Closed" ? "active" : ""}`}
      onClick={() => setFilter("Closed")}
    >
      Closed
    </button>
    <button
      className={`filter-btn btn btn-outline-success mx-3 px-3 ${filter === "all" ? "active" : ""}`}
      onClick={() => setFilter("all")}
    >
      All
    </button>
  </div>
  <button
    className="mt-4 px-3 add-lead-btn btn btn-success"
    onClick={() => navigate("/addNewLead")} 
  >
    Add New Lead
  </button>
</div>


          </div>
        </div>
      </div>
    </div>
  )
}