
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leads from "./pages/Leads"
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import AddNewLead from './pages/AddNewLead';
import AddNewAgent from './pages/AddNewAgent';
import LeadDetails from './pages/LeadDetails'
import LeadStatusView from './pages/LeadStatusView';
import LeadByAgent from './pages/LeadByAgent';


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/addNewLead" element={<AddNewLead />}/>
        <Route path="/addNewAgent" element={<AddNewAgent />}/>
        <Route path="/leadStatusView" element={<LeadStatusView />}/>
        <Route path="/leadAgentView" element={<LeadByAgent />}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
