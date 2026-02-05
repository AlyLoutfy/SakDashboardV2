import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import IntegrationsPage from "./pages/IntegrationsPage";
import DesignsPage from "./pages/DesignsPage";
import ReportsPage from "./pages/ReportsPage";
import PaymentPlansPage from "./pages/PaymentPlansPage";
import BlockingRequestsPage from "./pages/BlockingRequestsPage";
import ReservationRequestsPage from "./pages/ReservationRequestsPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/integrations" replace />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="designs" element={<DesignsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="payment-plans" element={<PaymentPlansPage />} />
          <Route path="blocking-requests" element={<BlockingRequestsPage />} />
          <Route path="reservation-requests" element={<ReservationRequestsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
