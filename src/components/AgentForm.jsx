import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgentForm = () => {
  const [agent, setAgent] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };


async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('https://crm-app-backend-jade.vercel.app/agents', agent);
      toast.success("Agent created!", { position: "bottom-right"});
    setAgent({ name: "", email: "" });
    } catch (err) {
      console.error('Agent POST error:', err.response ? err.response.data : err);
      toast.error("Error!", { position: "bottom-right"});
    }
  }

  return (
    <div className="container my-5 d-flex justify-content-center">

          <form onSubmit={handleSubmit}>
            <div className="row mb-3 align-items-center">
              <label className="form-label col-md-4 fs-3" htmlFor="agentName">
                Agent Name:
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  name="name"
                  id="agentName"
                  className="form-control fs-4"
                  value={agent.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3 align-items-center">
              <label className="form-label col-md-4 fs-3" htmlFor="agentEmail">
                Email Address:
              </label>
              <div className="col-md-8">
                <input
                  type="email"
                  name="email"
                  id="agentEmail"
                  className="form-control fs-4"
                  value={agent.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-1">
              <div className="col-md-8 offset-md-4">
                <button type="submit" className="btn btn-success fs-4 w-100">
                  Create Agent
                </button>
              </div>
            </div>
          </form>
          <ToastContainer />
        </div>
  );
};

export default AgentForm;


