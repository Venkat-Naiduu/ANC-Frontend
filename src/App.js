import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ScheduleManager from './components/Schedule/ScheduleManager';
import EntityInputForm from './components/EntityInput/EntityInputForm'; 

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/schedule-manager" element={<ScheduleManager />} />
      {/* Add other routes as needed */}
      <Route path="*" element={<Dashboard />} /> {/* fallback route */}
      <Route path="/entity-input" element={<EntityInputForm/>}/>
    </Routes>
  );
}

export default App;