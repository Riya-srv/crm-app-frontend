import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
import axios from "axios";
import Nav from "../components/Nav";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    source: "",
    status: "",
    priority: "",
    timeToClose: 0,
    salesAgent: ""
  });

  const [newComment, setNewComment] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(""); // dropdown for Author

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadRes, commentRes, agentsRes] = await Promise.all([
          axios.get(`https://crm-app-backend-jade.vercel.app/leads/${id}`),
          axios.get(`https://crm-app-backend-jade.vercel.app/leads/${id}/comments`),
          axios.get(`https://crm-app-backend-jade.vercel.app/agents`)
        ]);

        const leadData = leadRes.data;
        setLead(leadData);
        setForm({
          name: leadData.name || "",
          source: leadData.source || "",
          status: leadData.status || "",
          priority: leadData.priority || "",
          timeToClose: leadData.timeToClose || 0,
          salesAgent: leadData.salesAgent?._id || ""
        });
        setComments(commentRes.data);
        setSalesAgents(agentsRes.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`https://crm-app-backend-jade.vercel.app/leads/${id}`, form);
      const updatedLead = await axios.get(`https://crm-app-backend-jade.vercel.app/leads/${id}`);
      setLead(updatedLead.data);
      setIsEditing(false);
    } catch {
      alert("Error updating lead");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!selectedAuthor) {
      alert("Please select an author before adding a comment.");
      return;
    }

    await axios.post(`https://crm-app-backend-jade.vercel.app/leads/${id}/comments`, {
      commentText: newComment,
      author: selectedAuthor // selected sales agent name
    });
    setNewComment("");
    setSelectedAuthor("");
    const commentRes = await axios.get(`https://crm-app-backend-jade.vercel.app/leads/${id}/comments`);
    setComments(commentRes.data);
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
  if (!lead) return <div>Lead not found.</div>;

  return (
    <>
      <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
        <NavLink className="navbar-brand" to="/">
          <h1 className="text-center">Lead Management: {lead.name}</h1>
        </NavLink>
      </nav>
      <div className="row">
        <div className="col-2 p-0 sidebar-green">
          <BackToDashboardSideBar />
        </div>
        <div className="col-6 container py-3">
          <h2 className="mb-4">Lead Details</h2>

          {!isEditing ? (
            <div className="border-bottom pb-3 mb-3 fs-4">
              <div><strong>Lead Name:</strong> {lead.name}</div>
              <div><strong>Sales Agent:</strong> {lead.salesAgent?.name || "Unknown"}</div>
              <div><strong>Lead Source:</strong> {lead.source}</div>
              <div><strong>Lead Status:</strong> {lead.status}</div>
              <div><strong>Priority:</strong> {lead.priority}</div>
              <div><strong>Time to Close:</strong> {lead.timeToClose} days</div>
              <button className="btn btn-success mt-3" onClick={handleEditToggle}>
                Edit Lead Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Lead Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleFormChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="salesAgent" className="form-label">Sales Agent</label>
                <select id="salesAgent" name="salesAgent" value={form.salesAgent} onChange={handleFormChange} className="form-select" required>
                  <option value="">Select Agent</option>
                  {salesAgents.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="source" className="form-label">Lead Source</label>
                <input type="text" id="source" name="source" value={form.source} onChange={handleFormChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">Lead Status</label>
                <input type="text" id="status" name="status" value={form.status} onChange={handleFormChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="priority" className="form-label">Priority</label>
                <input type="text" id="priority" name="priority" value={form.priority} onChange={handleFormChange} className="form-control" required />
              </div>

              <div className="mb-3">
                <label htmlFor="timeToClose" className="form-label">Time to Close (days)</label>
                <input type="number" id="timeToClose" name="timeToClose" value={form.timeToClose} onChange={handleFormChange} className="form-control" min="0" required />
              </div>

              <button type="submit" className="btn btn-success me-2">Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleEditToggle}>Cancel</button>
            </form>
          )}

          {/* Comments Section */}
          <h3 className="mt-4">Comments Section</h3>
          {comments.length === 0 && <div>No comments yet.</div>}
          {comments.map((comment, idx) => (
            <div key={idx} className="border p-2 mb-2">
              <div>
                <strong>{comment.author || "Anonymous"}</strong> - {new Date(comment.createdAt).toLocaleString()}
              </div>
              <div>Comment: {comment.commentText}</div>
            </div>
          ))}

          {/* Add new comment with author dropdown */}
          <form className="mt-3" onSubmit={handleAddComment}>
            <div className="mb-2">
              <label className="form-label">Author (Sales Agent)</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="form-select mb-2"
                required
              >
                <option value="">Select Author</option>
                {salesAgents.map(agent => (
                  <option key={agent._id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a new comment..."
              className="form-control mb-2"
              required
            />
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
