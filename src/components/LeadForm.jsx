import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const leadSources = ["Website", "Referral", "Cold Call"];
const leadStatuses = ["New", "Contracted", "Qualified", "Proposal Sent", "Closed"];
const priorityOptions = ["High", "Medium", "Low"];
const tagsOptions = ["High Value", "Follow-up"];

const LeadForm = () => {
  const [form, setForm] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    tags: [],
    timeToClose: 0,
    priority: ""
  });

  const [salesAgents, setSalesAgents] = useState([]);
  useEffect(() => {
    axios.get('https://crm-app-backend-jade.vercel.app/agents').then(res => setSalesAgents(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      if (checked) {
        return { ...prev, tags: [...prev.tags, value] };
      } else {
        return { ...prev, tags: prev.tags.filter(tag => tag !== value) };
      }
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/leads', form);
      toast.success("Lead created!", { position: "bottom-right"});
      setForm({
        name: "",
        source: "",
        salesAgent: "",
        status: "",
        tags: [],
        timeToClose: 0,
        priority: ""
      });
    } catch (err) {
      alert('Error creating lead');
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="container mt-4 px-3">
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3" htmlFor="leadName">
            Lead Name:
          </label>
          <div className="col-md-9">
            <input
              className="form-control fs-3"
              type="text"
              name="name"
              id="leadName"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3" htmlFor="leadSource">
            Lead Source:
          </label>
          <div className="col-md-9">
            <select
              className="form-control fs-3"
              name="source"
              id="leadSource"
              value={form.source}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select source</option>
              {leadSources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3" htmlFor="salesAgent">
            Select Sales Agent:
          </label>
          <div className="col-md-9">
            <select
              className="form-control fs-3"
              name="salesAgent"
              id="salesAgent"
              value={form.salesAgent}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select agent</option>
              {salesAgents.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3" htmlFor="leadStatus">
            Lead Status:
          </label>
          <div className="col-md-9">
            <select
              className="form-control fs-3"
              name="status"
              id="leadStatus"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select status</option>
              {leadStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3">
            Tags:
          </label>
          <div className="col-md-9">
            {tagsOptions.map(tag => (
              <div className="form-check form-check-inline fs-3" key={tag}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="tags"
                  id={`tag-${tag}`}
                  value={tag}
                  checked={form.tags.includes(tag)}
                  onChange={handleTagsChange}
                />
                <label className="form-check-label" htmlFor={`tag-${tag}`}>{tag}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3" htmlFor="timeToClose">
            Time to Close (days):
          </label>
          <div className="col-md-9">
            <input
              className="form-control fs-3"
              type="number"
              name="timeToClose"
              id="timeToClose"
              value={form.timeToClose}
              onChange={handleChange}
              required
              min={1}
            />
          </div>
        </div>
        <div className="row mb-3 align-items-center">
          <label className="form-label fs-3 col-md-3" htmlFor="priority">
            Priority:
          </label>
          <div className="col-md-9">
            <select
              className="form-control fs-3"
              name="priority"
              id="priority"
              value={form.priority}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select priority</option>
              {priorityOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-9 offset-md-3">
            <button className="btn btn-success fs-4" type="submit">Create Lead</button>
          </div>
        </div>
      </div>
    </form>
    <ToastContainer />
    </>
  );
};

export default LeadForm;
