import { useState, useEffect } from "react";
import BackToDashboardSideBar from "../components/BackToDashboardSideBar";
import axios from "axios";
import Nav from "../components/Nav";

//installed recharts using npm
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ["#009688", "#ffc658", "#FF8042", "#82ca9d", "#ff6666", "#8884d8"];

export default function Reports() {
  const [pipelineReport, setPipelineReport] = useState([]);
  const [closedByAgent, setClosedByAgent] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [pipelineRes, closedAgentRes, leadsRes] = await Promise.all([
        axios.get("https://crm-app-backend-jade.vercel.app/report/pipeline"),
        axios.get("https://crm-app-backend-jade.vercel.app/report/closed-by-agent"),
        axios.get("https://crm-app-backend-jade.vercel.app/leads")
      ]);
      // Pie: closed vs pipeline
      setPipelineReport([
        { name: "Closed", value: pipelineRes.data.find(d => d._id === "Closed")?.count || 0 },
        { name: "Pipeline", value: pipelineRes.data.reduce((acc, cur) => cur._id !== "Closed" ? acc + cur.count : acc, 0) }
      ]);
      // Bar: by agent
      setClosedByAgent(closedAgentRes.data.map(d => ({
        name: d.salesAgentName,
        Closed: d.closedCount
      })));
      // Pie/bar: status distribution
      const statusMap = {};
      for (const lead of leadsRes.data) {
        statusMap[lead.status] = (statusMap[lead.status] || 0) + 1;
      }
      setStatusDist(Object.entries(statusMap).map(([status, count]) => ({
        name: status,
        value: count
      })));
      setLoading(false);
    }
    fetchAll();
  }, []);

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
    <div>
      <nav className="navbar bg-success d-flex justify-content-center py-3 px-0">
        <h1 className="text-center">Anvaya CRM Reports</h1>
      </nav>
      <div className="row">
        <div className="col-2 p-0 sidebar-green">
          <BackToDashboardSideBar />
        </div>
        <div className="col-8 py-4">
          <h2 className="mb-4">Report Overview</h2>
          {/* Pie Chart: Closed vs Pipeline */}
          <h4>Total Leads Closed and in Pipeline</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pipelineReport}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={entry => `${entry.name} (${entry.value})`}
              >
                {pipelineReport.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <hr />

          {/* Bar Chart: Closed by Agent */}
          <h4>Leads Closed by Sales Agent</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={closedByAgent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Closed" fill="#009688" />
            </BarChart>
          </ResponsiveContainer>
          <hr />

          {/* Pie Chart (or use Bar): Status Distribution */}
          <h4>Lead Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDist}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={entry => `${entry.name} (${entry.value})`}
                
              >
                {statusDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
