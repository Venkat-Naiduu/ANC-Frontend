import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ScheduleManager from './components/Schedule/ScheduleManager';
import EntityInputForm from './components/EntityInput/EntityInputForm';
import ActiveRecords from './components/Schedule/ActiveRecords';
// import ActiveTable from './components/Schedule/ActiveTable';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/schedule-manager" element={<ScheduleManager />} />
      <Route path="/entity-input" element={<EntityInputForm/>}/>
      <Route path="/active-records" element={<ActiveRecords />} />
      {/* <Route path="/active-table" element={<ActiveTable />} /> */}
      {/* Add other routes as needed */}
      <Route path="*" element={<Dashboard />} /> {/* fallback route */}
    </Routes>
  );
}

export default App;