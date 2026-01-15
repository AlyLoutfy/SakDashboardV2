import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import IntegrationsPage from './pages/IntegrationsPage';
import DesignsPage from './pages/DesignsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/integrations" replace />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="designs" element={<DesignsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
